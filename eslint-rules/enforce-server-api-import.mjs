import path from "path";
import fs from "fs";

const loadServerApiPath = path.resolve("src/server-api/load-server-api.ts");
const tsconfigPath = path.resolve("tsconfig.json");

// Read tsconfig.json to get path aliases
const getTsConfigPaths = () => {
    try {
        const tsConfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        return tsConfig.compilerOptions?.paths || {};
    } catch (error) {
        console.error("Error reading tsconfig.json:", error);
        return {};
    }
};

// Convert a path using aliases to a regular path
const resolveAliasPath = (importPath, paths) => {
    for (const [alias, targets] of Object.entries(paths)) {
        const aliasPattern = alias.replace(/\*$/, '');
        if (importPath.startsWith(aliasPattern)) {
            const relativePath = importPath.slice(aliasPattern.length);
            const target = targets[0].replace(/\*$/, '');
            return path.join(target, relativePath);
        }
    }
    return importPath;
};

// Get all imports from the load-server-api.ts file
const getServerApiImports = () => {
    try {
        const content = fs.readFileSync(loadServerApiPath, 'utf8');
        const importRegex = /import\s+(?:.*\s+from\s+)?["'](.+?)["'];?/g;
        const imports = [];
        let match;

        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }

        // Also look for commented imports or imports in progress
        // This prevents false positives when a developer is in the middle of adding an import
        const commentedImportRegex = /\/\/\s*import\s+(?:.*\s+from\s+)?["'](.+?)["'];?/g;
        while ((match = commentedImportRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }

        // Check for incomplete imports at the end of the file (no semicolon yet)
        const lines = content.split('\n');
        const lastLine = lines[lines.length - 1].trim();
        if (lastLine.startsWith('import') && !lastLine.endsWith(';')) {
            const incompleteMatch = /import\s+(?:.*\s+from\s+)?["'](.+?)["']/.exec(lastLine);
            if (incompleteMatch) {
                imports.push(incompleteMatch[1]);
            }
        }

        return imports;
    } catch (error) {
        console.error("Error reading load-server-api.ts:", error);
        return [];
    }
};

export default {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce server API functions to be imported in load-server-api.ts",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: "code",
        schema: [], // no options
    },
    create(context) {
        const sourceFilePath = context.getFilename();

        // Skip if this is the load-server-api.ts file itself
        if (sourceFilePath.endsWith('load-server-api.ts')) {
            return {};
        }

        // Track import statements to check if createServerApi is imported
        const serverApiImports = [];

        return {
            // First collect all imports
            ImportDeclaration(node) {
                const importSource = node.source.value;
                if (importSource.includes('server-api/create-server-api')) {
                    // Found the server-api import, now check which imports are used
                    node.specifiers.forEach(specifier => {
                        if (specifier.type === 'ImportSpecifier' &&
                            specifier.imported && specifier.imported.name === 'createServerApi') {
                            // Track the local name used for createServerApi
                            serverApiImports.push(specifier.local.name);
                        } else if (specifier.type === 'ImportDefaultSpecifier') {
                            // Handle default imports
                            serverApiImports.push(specifier.local.name);
                        }
                    });
                }
            },

            // Then check calls to createServerApi
            CallExpression(node) {
                // Check if it's a call to createServerApi (using the local names we collected)
                if (
                    node.callee.type === "Identifier" &&
                    serverApiImports.includes(node.callee.name)
                ) {
                    const serverApiFileImports = getServerApiImports();
                    const tsConfigPaths = getTsConfigPaths();

                    // Get relative path from project root to the current file
                    const relativePath = path.relative(
                        process.cwd(),
                        sourceFilePath
                    ).replace(/\\/g, '/');

                    // Calculate the import path if we need to suggest it
                    const fileWithoutExt = relativePath.replace(/\.tsx?$/, '');

                    // Generate possible import paths that could be used
                    const possibleImports = [];
                    const fileName = path.basename(fileWithoutExt);
                    const dirName = path.basename(path.dirname(fileWithoutExt));

                    // Check all path aliases in tsconfig.json
                    for (const [alias, targets] of Object.entries(tsConfigPaths)) {
                        const aliasPattern = alias.replace(/\*$/, '');
                        const targetPath = targets[0].replace(/\*$/, '').replace("./", "");

                        if (relativePath.startsWith(targetPath)) {
                            const pathAfterTarget = relativePath.slice(targetPath.length).replace(/\.tsx?$/, '');
                            possibleImports.push(`${aliasPattern}${pathAfterTarget}`);
                        }
                    }

                    // Regular relative path
                    possibleImports.push(`./${fileWithoutExt}`);
                    possibleImports.push(fileWithoutExt);

                    // Handle index files with and without explicit "index"
                    const isIndexFile = fileName === 'index';
                    if (isIndexFile) {
                        const directoryPath = fileWithoutExt.replace(/\/index$/, '');
                        possibleImports.push(directoryPath);

                        // Check all path aliases again for the directory path
                        for (const [alias, targets] of Object.entries(tsConfigPaths)) {
                            const aliasPattern = alias.replace(/\*$/, '');
                            const targetPath = targets[0].replace(/\*$/, '').replace("./", "");

                            const dirRelativePath = path.dirname(relativePath);
                            if (dirRelativePath.startsWith(targetPath)) {
                                const pathAfterTarget = dirRelativePath.slice(targetPath.length);
                                possibleImports.push(`${aliasPattern}${pathAfterTarget}`);
                            }
                        }
                    }

                    // Add variations with extensions for all paths
                    const extensionsToTry = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
                    const pathsWithoutExtensions = [...possibleImports];

                    for (const basePath of pathsWithoutExtensions) {
                        for (const ext of extensionsToTry) {
                            possibleImports.push(`${basePath}${ext}`);
                        }

                        // For index files, add variations with explicit index and extensions
                        if (isIndexFile && !basePath.endsWith('/index')) {
                            possibleImports.push(`${basePath}/index`);
                            for (const ext of extensionsToTry) {
                                possibleImports.push(`${basePath}/index${ext}`);
                            }
                        }
                    }

                    // Remove duplicates
                    const uniqueImports = [...new Set(possibleImports)];

                    // Simplified check: See if any import in load-server-api.ts contains:
                    // - The file's directory name AND
                    // - The file's name or similar pattern
                    const importFound = serverApiFileImports.some(importPath => {
                        // Exact match of any possible import paths
                        if (uniqueImports.includes(importPath)) {
                            return true;
                        }

                        // Check if the import contains both the directory name and file name
                        // This handles various import syntaxes and partial matches
                        const importHasDir = importPath.includes(dirName);
                        const importHasFile = importPath.includes(fileName) ||
                            (fileName === 'index' && importPath.endsWith(dirName));

                        return importHasDir && importHasFile;
                    });

                    if (!importFound) {
                        // Check if the file is already being edited in load-server-api.ts
                        try {
                            const currentContent = fs.readFileSync(loadServerApiPath, 'utf8');

                            // Check if either the directory or file name is mentioned in comments
                            const editInProgress = currentContent.split('\n').some(line =>
                                (line.includes(fileName) || line.includes(dirName)) &&
                                line.includes('//')
                            );

                            if (editInProgress) {
                                return; // Skip if it seems like the file is being edited
                            }
                        } catch (error) {
                            // Ignore errors, proceed with normal behavior
                        }

                        // Determine best import format by checking existing imports
                        let suggestedImport = uniqueImports[0]; // Default to alias format

                        // Check existing imports to determine the preferred style
                        if (serverApiFileImports.length > 0) {
                            const exampleImport = serverApiFileImports[0];
                            if (exampleImport.startsWith('@/')) {
                                // Use alias style if other imports use it
                                suggestedImport = uniqueImports.find(p => p.startsWith('@/')) || suggestedImport;
                            } else if (exampleImport.startsWith('./')) {
                                // Use relative style if other imports use it
                                suggestedImport = uniqueImports.find(p => p.startsWith('./')) || suggestedImport;
                            }
                        }

                        context.report({
                            node,
                            message: `Server API function must be imported in load-server-api.ts. Add 'import "${suggestedImport}";' to load-server-api.ts.`,
                            fix(fixer) {
                                // Note: ESLint can't directly modify another file, so we return null
                                // and provide clear instructions in the message
                                return null;
                            }
                        });
                    }
                }
            }
        };
    }
};


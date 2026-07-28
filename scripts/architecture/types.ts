export interface ImportRule {
    id: string;
    sourcePrefixes: string[];
    importPatterns: string[];
    message: string;
}

export interface ArchitecturePolicy {
    version: number;
    baselineCommit: string;
    approvalsFile: string;
    sourceRoots: string[];
    sourceExtensions: string[];
    ignoredDirectories: string[];
    warningThresholds: {
        authoredFileLines: number;
        pathDepth: number;
    };
    importRules: ImportRule[];
    clientForbiddenImportPatterns: string[];
}

export interface CoreChangeApproval {
    requestId: string;
    path: string;
    status: 'approved' | 'pending' | 'rejected';
    approvedContentSha256?: string;
    scope: string;
    record: string;
}

export interface CoreChangeApprovalFile {
    version: number;
    baselineCommit: string;
    approvals: CoreChangeApproval[];
}

export interface WorkspacePackage {
    name: string;
    directory: string;
    dependencies: Set<string>;
}

export interface Finding {
    severity: 'error' | 'warning';
    rule: string;
    path: string;
    message: string;
}

export interface DiffEntry {
    status: string;
    paths: string[];
}

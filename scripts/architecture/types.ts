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
    placement: PlacementPolicy;
}

export interface PlacementPolicy {
    baselineCommit: string;
    manifestsDirectory: string;
    governedPrefixes: string[];
    forbiddenPathPatterns: Array<{
        id: string;
        pattern: string;
        message: string;
    }>;
    allowedNewWorkspacePackageDirectories: string[];
}

export type SlicePathClassification = 'new' | 'protected-original';

export interface SlicePathDeclaration {
    path: string;
    classification: SlicePathClassification;
    role: string;
    coreChangeRequest?: string;
}

export interface ArchitectureSliceManifest {
    version: 1;
    slice: string;
    capability: string;
    owningRuntime: string;
    paths: SlicePathDeclaration[];
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

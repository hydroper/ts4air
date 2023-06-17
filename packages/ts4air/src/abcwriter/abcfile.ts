export class AbcFile {
    public majorVersion: number = 46;
    public minorVersion: number = 16;
    public constantPool: ConstantPool = new ConstantPool;
    public methods: MethodInfo[] = [];
    public metadata: MetadataInfo[] = [];
    public instances: InstanceInfo[] = [];
    public classes: ClassInfo[] = [];
    public scripts: ScriptInfo[] = [];
    public methodBodies: MethodBodyInfo[] = [];
}

export class ConstantPool {
    public integers: number[] = [];
    public unsignedIntegers: number[] = [];
    public doubles: number[] = [];
    public strings: string[] = [];
    public namespaces: NamespaceInfo[] = [];
    public nsSets: NsSetInfo[] = [];
    public multinames: MultinameInfo[] = [];
}

export class NamespaceInfo {
    public kind: NamespaceInfoKind;
    /**
     * Index into the string section of the constant pool.
     */
    public name: number;

    /**
     * @param name Index into the string section of the constant pool.
     */
    constructor(kind: NamespaceInfoKind, name: number) {
        this.kind = kind;
        this.name = name;
    }
}

export type NamespaceInfoKind
    = 'namespace'
    | 'packageNamespace'
    | 'packageInternalNs'
    | 'protectedNs'
    | 'explicitNs'
    | 'staticProtectedNs'
    | 'privateNs';

export class NsSetInfo {
    /**
     * @param namespaces List of indexes into the namespace section of the constant pool.
     */
    constructor(public namespaces: number[] = []) {
    }
}

export class MultinameInfo {
    constructor(public isAttribute: boolean) {
        this.isAttribute = isAttribute;
    }
}

/**
 * MultinameInfo: QName and QNameA
 */
export class QNameMultinameInfo extends MultinameInfo {
    /**
     * @param ns Index into the namespace section of the constant pool.
     * @param name Index into the string section of the constant pool.
     */
    constructor(public ns: number, public name: number, isAttribute: boolean = false) {
        super(isAttribute);
        this.ns = ns;
        this.name = name;
    }
}

/**
 * MultinameInfo: RTQName and RTQNameA
 */
export class RTQNameMultinameInfo extends MultinameInfo {
    /**
     * @param name Index into the string section of the constant pool.
     */
    constructor(public name: number, isAttribute: boolean = false) {
        super(isAttribute);
        this.name = name;
    }
}

/**
 * MultinameInfo: RTQNameL and RTQNameLA
 */
export class RTQNameLMultinameInfo extends MultinameInfo {
    constructor(isAttribute: boolean = false) {
        super(isAttribute);
    }
}

/**
 * MultinameInfo: Multiname and MultinameA
 */
export class MultinameMultinameInfo extends MultinameInfo {
    /**
     * @param name Index into the string section of the constant pool.
     * @param ns_set Index into the `nsSets` section of the constant pool.
     */
    constructor(public name: number, public nsSet: number, isAttribute: boolean = false) {
        super(isAttribute);
        this.name = name;
        this.nsSet = nsSet;
    }
}

/**
 * MultinameInfo: MultinameL and MultinameLA
 */
export class MultinameLMultinameInfo extends MultinameInfo {
    /**
     * @param ns_set Index into the `nsSets` section of the constant pool.
     */
    constructor(public nsSet: number, isAttribute: boolean = false) {
        super(isAttribute);
        this.nsSet = nsSet;
    }
}

export class MethodInfo {
    public paramCount: number;
    /**
     * Index into the multiname section of the constant pool.
     */
    public returnType: number;
    /**
     * Indexes into the multiname section of the constant pool.
     */
    public paramTypes: number[] = [];
    /**
     * Index into the string section of the constant pool.
     */
    public name: number;
    public flags: number;
    public options: OptionDetail[] = null;
    public paramNames: number[] = null;
}

export const MethodInfoFlags = {
    NEEDS_ARGUMENTS: 0x01,
    NEEDS_ACTIVATION: 0x02,
    NEEDS_REST: 0x04,
    HAS_OPTIONAL: 0x08,
    SET_DXNS: 0x40,
    HAS_PARAM_NAMES: 0x80,
};

export class OptionDetail {
    /**
     * @param value Index into one of the constant pool sections according
     * to `kind`.
     */
    constructor(public value: number, public kind: ConstantValueKind) {
    }
}

export type ConstantValueKind
    = 'int'
    | 'uint'
    | 'double'
    | 'utf8'
    | 'true'
    | 'false'
    | 'null'
    | 'undefined'
    | 'namespace'
    | 'packageNamespace'
    | 'packageInternalNs'
    | 'protectedNamespace'
    | 'explicitNamespace'
    | 'staticProtectedNs'
    | 'privateNs';


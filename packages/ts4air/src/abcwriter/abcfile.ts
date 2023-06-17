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

/**
 * Base class for constant pool multinames. Do not instantiate
 * this class directly.
 */
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
    public paramCount: number = 0;
    /**
     * Index into the multiname section of the constant pool.
     */
    public returnType: number = 0;
    /**
     * Indexes into the multiname section of the constant pool.
     */
    public paramTypes: number[] = [];
    /**
     * Index into the string section of the constant pool.
     */
    public name: number = 0;
    /**
     * Flags represnted by `MethodInfoFlags`.
     */
    public flags: number = 0;

    public options: OptionDetail[] = null;

    /**
     * Indexes into the string section of the constant pool.
     */
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

export class MetadataInfo {
    /**
     * @param name Index into the string section of the constant pool.
     */
    constructor(public name: number, public items: MetadataItemInfo[]) {
    }
}

export class MetadataItemInfo {
    /**
     * @param key Index into the string section of the constant pool.
     * If zero, the item is a keyless entry carrying only a value.
     * @param value Index into the string section of the constant pool.
     */
    constructor(public key: number, public value: number) {
    }
}

export class InstanceInfo {
    /**
     * Index into the multiname section of the constant pool. Must be a QName.
     */
    public name: number = 0;
    /**
     * Index into the multiname section of the constant pool.
     * Provides the name of the base (super) class, if any.
     * Assign zero for no super class.
     */
    public superName: number = 0;

    /**
     * Flags represented by `InstanceInfoFlags`.
     */
    public flags: number = 0;

    /**
     * Index into the namespace section of the constant pool.
     * Must only be set if `flags` includes `InstanceInfoFlags.CLASS_PROTECTED_NS`.
     */
    public protectedNs: number = 0;

    /**
     * Indexes into the multiname section of the constant pool.
     */
    public interfaces: number[] = [];

    /**
     * Index into the method section of the ABC.
     */
    public iinit: number = 0;

    public traits: TraitInfo[] = [];

    constructor() {
    }
}

export const InstanceInfoFlags = {
    CLASS_SEALED: 0x01,
    CLASS_FINAL: 0x02,
    CLASS_INTERFACE: 0x04,
    CLASS_PROTECTED_NS: 0x08,
};

/**
 * Base class for traits. Do not instantiate this class directly.
 */
export class TraitInfo {
    /**
     * @param name Index into the multiname section of the constant pool.
     * Must be a non-zero QName.
     * @param attributes Attribute flags represented by `TraitAttributes`.
     * @param metadata Indexes into the metadata section of the ABC.
     */
    constructor(public name: number, public attributes: number = 0, public metadata: number[] = []) {
    }
}

export const TraitAttributes = {
    FINAL: 0x1,
    OVERRIDE: 0x2,
    METADATA: 0x4,
};

export class XTraitInfo extends TraitInfo {
    /**
     * @param name Index into the multiname section of the constant pool.
     * Must be a non-zero QName.
     * @param attributes Attribute flags represented by `TraitAttributes`.
     * @param metadata Indexes into the metadata section of the ABC.
     */
    constructor(public name: number, public attributes: number = 0, public metadata: number[] = []) {
        super(name, attributes, metadata);
    }
}
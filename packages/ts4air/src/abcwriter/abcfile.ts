import ByteArray from 'com.hydroper.util.nodejsbytearray';

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
    public integers: (null | number)[] = [null];
    public unsignedIntegers: (null | number)[] = [null];
    public doubles: (null | number)[] = [null];
    public strings: (null | string)[] = [null];
    public namespaces: (null | NamespaceInfo)[] = [null];
    public nsSets: (null | NsSetInfo)[] = [null];
    public multinames: (null | MultinameInfo)[] = [null];
}

export class NamespaceInfo {
    /**
     * @param name Index into the string section of the constant pool.
     */
    constructor(public kind: NamespaceInfoKind, public name: number) {
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
     * A zero indicates the any type (`*`).
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
    constructor(public value: ConstantValue) {
    }
}

export class ConstantValue {
    /**
     * @param value Index into one of the constant pool sections according
     * to `kind`.
     */
    constructor(public kind: ConstantValueKind, public value: number) {
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

export class SlotTraitInfo extends TraitInfo {
    public isConst: boolean;
    /**
     * Integer from 0 to N used to identify a position
     * in which this trait resides.
     */
    public slotId: number;

    /**
     * Index into the multiname section of the constant pool.
     * A value of zero indicates the any type (`*`).
     */
    public typeName: number;

    public value: ConstantValue;

    constructor(options: SlotTraitInfoOptions) {
        // isReadonly identifies a "const"
        super(options.name, options.attributes === undefined ? 0 : options.attributes, options.metadata === undefined ? [] : options.metadata);
        this.isConst = options.isConst;
        this.slotId = options.slotId;
        this.typeName = options.typeName;
        this.value = options.value;
    }
}

export type SlotTraitInfoOptions = {
    /**
     * Index into the multiname section of the constant pool.
     * Must be a non-zero QName.
     */
    name: number,
    isConst: boolean,
    /**
     * Integer from 0 to N used to identify a position
     * in which this trait resides.
     */
    slotId: number,
    /**
     * Index into the multiname section of the constant pool.
     * A value of zero indicates the any type (`*`).
     */
    typeName: number,
    value: ConstantValue,
    /**
     * Attribute flags represented by `TraitAttributes`.
     */
    attributes?: undefined | number,
    /**
     * Indexes into the metadata section of the ABC.
     */
    metadata?: undefined | number[],
};

export class ClassTraitInfo extends TraitInfo {
    /**
     * @param name Index into the multiname section of the constant pool.
     * Must be a non-zero QName.
     * @param slotId Integer from 0 to N used to identify a position in which this trait resides.
     * @param classIndex Index into the class section of the ABC.
     * @param attributes Attribute flags represented by `TraitAttributes`.
     * @param metadata Indexes into the metadata section of the ABC.
     */
    constructor(public name: number, public slotId: number, public classIndex: number, public attributes: number = 0, public metadata: number[] = []) {
        super(name, attributes, metadata);
    }
}

export class FunctionTraitInfo extends TraitInfo {
    /**
     * @param name Index into the multiname section of the constant pool.
     * Must be a non-zero QName.
     * @param slotId Integer from 0 to N used to identify a position in which this trait resides.
     * @param methodIndex Index into the method section of the ABC.
     * @param attributes Attribute flags represented by `TraitAttributes`.
     * @param metadata Indexes into the metadata section of the ABC.
     */
    constructor(public name: number, public slotId: number, public methodIndex: number, public attributes: number = 0, public metadata: number[] = []) {
        super(name, attributes, metadata);
    }
}

export class MethodTraitInfo extends TraitInfo {
    /**
     * @param name Index into the multiname section of the constant pool.
     * Must be a non-zero QName.
     * @param methodIndex Index into the method section of the ABC.
     * @param dispId Compiler assigned integer for optimizing virtual function calls. A value
     * of zero disables this optimization. Consult the AVM2 Overview document for more information.
     * @param attributes Attribute flags represented by `TraitAttributes`.
     * @param metadata Indexes into the metadata section of the ABC.
     */
    constructor(public name: number, public methodKind: MethodTraitKind, public methodIndex: number, public dispId: number, public attributes: number = 0, public metadata: number[] = []) {
        super(name, attributes, metadata);
    }
}

export type MethodTraitKind = 'method' | 'getter' | 'setter';

export class ClassInfo {
    /**
     * @param staticInit Index into the method section of the ABC.
     * References the method that is invoked when the class is first created, also
     * known as static initializer.
     */
    constructor(public staticInit: number, public traits: TraitInfo[]) {
    }
}

export class ScriptInfo {
    /**
     * @param initMethod Index into the method section of the ABC.
     */
    constructor(public initMethod: number, public traits: TraitInfo[]) {
    }
}

export class MethodBodyInfo {
    /**
     * Index into the method section of the ABC.
     */
    public method: number = 0;
    public maxStack: number = 0;
    public localCount: number = 0;
    public initScopeDepth: number = 0;
    public maxScopeDepth: number = 0;
    public code: ByteArray;
    public exceptions: ExceptionInfo[] = [];
    public traits: TraitInfo[] = [];

    constructor() {
    }
}

export class ExceptionInfo {
    /**
     * The starting position in the `methodBody.code` field from which the exception is enabled. 
     */
    public from: number = 0;
    /**
     * The ending position in the `methodBody.code` field after which the exception is disabled. 
     */
    public to: number = 0;

    /**
     * Target position in the `methodBody.code` field.
     */
    public target: number = 0;

    /**
     * Index into the string section of the constant pool.
     * Zero means any type.
     */
    public exceptionType: number = 0;

    /**
     * Index into the string section of the constant pool indicating
     * the variable to receive the exception object when any exception is thrown.
     * If zero, there is no name associated with the exception object.
     */
    public varName: number = 0;
}
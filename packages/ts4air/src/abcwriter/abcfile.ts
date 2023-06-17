import DynamicTypedArray from 'dynamic-typed-array';

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
    public integers: DynamicTypedArray<Int32Array> = new DynamicTypedArray(Int32Array);
    public unsignedIntegers: DynamicTypedArray<Uint32Array> = new DynamicTypedArray(Uint32Array);
    public doubles: DynamicTypedArray<Float64Array> = new DynamicTypedArray(Float64Array);
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
     * List of indexes into the namespace section of the constant pool.
     */
    public namespaces: DynamicTypedArray<Uint32Array>;

    /**
     * @param namespaces List of indexes into the namespace section of the constant pool.
     */
    constructor(namespaces: DynamicTypedArray<Uint32Array> = new DynamicTypedArray(Uint32Array)) {
        this.namespaces = namespaces;
    }
}
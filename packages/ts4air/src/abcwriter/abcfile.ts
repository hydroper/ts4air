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
}
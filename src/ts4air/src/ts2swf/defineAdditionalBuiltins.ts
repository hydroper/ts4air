import Ts2SwfState from './state';
import {
    ClassInfo,
    ClassTraitInfo,
    FunctionTraitInfo,
    MethodTraitInfo,
    MethodInfo,
    InstanceInfo,
    MethodBodyInfo,
    SlotTraitInfo,
    ConstantValue,
} from 'ts4air/abc/abcFile';
import AbcFileWriter from 'ts4air/abc/abcWriter';

export default function defineAdditionalBuiltins(state: Ts2SwfState) {
    const { abcFile } = state;

    function definePromise() {
        const qname = abcFile.constantPool.internQName(state.abcToplevelPubns, 'Promise');
        const wqname = abcFile.constantPool.internQName(state.abcAsPreludeUtilPubns, 'Promise');

        const classInfo = new ClassInfo(0, []);
        classInfo.staticInit = toDo();
        const classIdx = abcFile.classes.push(classInfo) - 1;

        const instanceInfo = new InstanceInfo();
        instanceInfo.name = qname;
        instanceInfo.superName = 0;
        instanceInfo.flags = toDo();
        instanceInfo.protectedNs = toDo();
        instanceInfo.iinit = definePromiseConstructor();
        const instanceIdx = abcFile.instances.push(instanceInfo) - 1;

        // - define private _promise using abcFile.constantPool.internQName(state.abcToplevelInternalNs, '_promise')
        const wrapped = new SlotTraitInfo({
            name: abcFile.constantPool.internQName(state.abcToplevelInternalNs, '_promise'),
            isConst: false,
            slotId: 0,
            typeName: abcFile.constantPool.internQName(state.abcAsPreludeUtilPubns, 'Promise'),
            value: new ConstantValue('null', 0),
        });
        toDo();
        instanceInfo.traits.push(wrapped);

        function definePromiseConstructor(): number {
            const methodInfo = new MethodInfo();
            methodInfo.paramCount = 1;
            methodInfo.returnType = 0;
            methodInfo.paramTypes = [state.abcFunctionName];
            methodInfo.name = abcFile.constantPool.internString('Promise');
            methodInfo.flags |= 0;
            const index = abcFile.methods.push(methodInfo) - 1;

            // - emit returnvoid at the end
            const methodBodyInfo = new MethodBodyInfo();
            methodBodyInfo.method = index;
            toDo();
            abcFile.methodBodies.push(methodBodyInfo);

            return index;
        }

        toDo();
    }

    function defineMap() {
        toDo();
    }

    function defineSet() {
        toDo();
    }

    definePromise();
    defineMap();
    defineSet();
}
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

        // com.asprelude.util.Promise
        const wrappedPromiseTypeName = abcFile.constantPool.internQName(state.abcAsPreludeUtilPubns, 'Promise');

        // - define private '_promise' field
        const wrappedPromiseName = abcFile.constantPool.internQName(state.abcToplevelInternalNs, '_promise');
        instanceInfo.traits.push(new SlotTraitInfo({
            name: wrappedPromiseName,
            isConst: false,
            slotId: 0,
            typeName: wrappedPromiseTypeName,
            value: new ConstantValue('null', 0),
        }));

        toDo();

        function definePromiseConstructor(): number {
            const methodInfo = new MethodInfo();
            methodInfo.paramCount = 1;
            methodInfo.returnType = 0;
            methodInfo.paramTypes = [0];
            methodInfo.name = abcFile.constantPool.internString('Promise');
            methodInfo.flags |= 0;
            const index = abcFile.methods.push(methodInfo) - 1;

            // - if given a com.asprelude.util.Promise, wrap it;
            // otherwise force argument to a Function and
            // construct a com.asprelude.util.Promise.
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
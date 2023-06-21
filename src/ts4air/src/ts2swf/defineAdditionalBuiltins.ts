import Ts2SwfState from './state';
import {
    ClassInfo,
    ClassTraitInfo,
    FunctionTraitInfo,
    MethodTraitInfo,
    MethodInfo,
    InstanceInfo,
} from 'ts4air/abc/abcFile';

export default function defineAdditionalBuiltins(state: Ts2SwfState) {
    const {abcFile} = state;

    function definePromise() {
        const qname = abcFile.constantPool.internQName(state.abcToplevelPubns, 'Promise');
        const wqname = abcFile.constantPool.internQName(state.abcAsPreludeUtilPubns, 'Promise');

        const classInfoObj = new ClassInfo(toDo());
        const classIdx = abcFile.classes.push(classInfoObj) - 1;

        const instanceInfoObj = new InstanceInfo();
        instanceInfoObj.name = qname;
        instanceInfoObj.superName = 0;
        instanceInfoObj.flags = toDo();
        instanceInfoObj.protectedNs = toDo();
        instanceInfoObj.interfaces = toDo();
        instanceInfoObj.iinit = toDo();
        instanceInfoObj.traits = toDo();
        const instanceIdx = abcFile.instances.push(instanceInfoObj) - 1;

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
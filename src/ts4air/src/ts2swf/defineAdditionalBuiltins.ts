import Ts2SwfState from './state';

export default function defineAdditionalBuiltins(state: Ts2SwfState) {
    const {abcFile} = state;
    function definePromise() {
        toDo();
    }
    function defineMap() {
        toDo();
    }
    function defineSet() {
        toDo();
    }
}
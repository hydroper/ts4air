import ByteArray, {Endian} from 'com.hydroper.util.nodejsbytearray';
import * as abc from './abcFile';
import {assert} from 'console';

export default class AbcFileWriter {
    public bytes = new ByteArray;

    constructor() {
        this.bytes.endian = 'littleEndian';
    }

    toNodejsBuffer() {
        return this.bytes.toNodejsBuffer();
    }

    u8(value: number) {
        this.bytes.writeByte(value);
    }

    u16(value: number) {
        this.bytes.writeUnsignedShort(value);
    }

    s24(value: number) {
        assert(value >= -0x80_00_00 && value <= 0x7F_FF_FF, `Invalid s24 range, given: ${value}.`);
        this.bytes.writeUnsignedShort(Math.abs(value) & 0xFF_FF);
        this.bytes.writeByte(value > -1 ? value >> 16 : -(value >> 16) | 0x80);
    }

    u30(value: number) {
        assert(value >= 0 && value <= 0x3F_FF_FF_FF, `Invalid u30 range, given: ${value}.`);
        this.u32(value);
    }

    u32(value: number) {
        assert(value >= 0 && value <= 0xFF_FF_FF_FF, `Invalid u32 range, given: ${value}.`);
        for (;;) {
            let byte = value & 0x7F;
            value >>= 7;
            if (value != 0) {
                this.u8(0b1000_0000 | byte);
            } else {
                this.u8(byte);
                break;
            }
        }
    }

    s32(value: number) {
        assert(value >= 0x80_00_00_00 && value <= 0x7F_FF_FF_FF, `Invalid s32 range, given: ${value}.`);
        this.u32(value >>> 0);
        if (value < 0) {
            this.bytes.set(this.bytes.position - 1, this.bytes.at(this.bytes.position - 1) | 0b0100_0000);
        }
    }

    d64(value: number) {
        this.bytes.writeDouble(value);
    }

    abcFile(abcFile: abc.AbcFile) {
        this.u16(abcFile.minorVersion);
        this.u16(abcFile.majorVersion);
        this.constantPool(abcFile.constantPool);
        this.u30(abcFile.methods.length);
        for (let method of abcFile.methods) {
            this.methodInfo(method);
        }
        this.u30(abcFile.metadata.length);
        for (let metadata of abcFile.metadata) {
            this.metadataInfo(metadata);
        }
        assert(abcFile.classes.length == abcFile.instances.length, 'Number of classes and instances must be equals.');
        this.u30(abcFile.classes.length);
        for (let inst of abcFile.instances) {
            this.instanceInfo(inst);
        }
        for (let c of abcFile.classes) {
            this.classInfo(c);
        }
        this.u30(abcFile.scripts.length);
        for (let script of abcFile.scripts) {
            this.scriptInfo(script);
        }
        this.u30(abcFile.methodBodies.length);
        for (let methodBody of abcFile.methodBodies) {
            this.methodBodyInfo(methodBody);
        }
    }

    constantPool(constantPool: abc.ConstantPool) {
        this.u30(constantPool.integers.length);
        for (let i of constantPool.integers) {
            this.s32(i);
        }
        this.u30(constantPool.unsignedIntegers.length);
        for (let i of constantPool.unsignedIntegers) {
            this.u32(i);
        }
        this.u30(constantPool.doubles.length);
        for (let n of constantPool.doubles) {
            this.d64(n);
        }
        this.u30(constantPool.strings.length);
        for (let str of constantPool.strings) {
            let ba = new ByteArray();
            ba.writeUTF8(str);
            this.u30(ba.length);
            this.bytes.writeBytes(ba);
        }
        this.u30(constantPool.namespaces.length);
        for (let ns of constantPool.namespaces) {
            this.u8(namespaceInfoKindValue.get(ns.kind));
            this.u30(ns.name);
        }
        this.u30(constantPool.nsSets.length);
        for (let nsSet of constantPool.nsSets) {
            this.u30(nsSet.namespaces.length);
            for (let ns of nsSet.namespaces) {
                this.u30(ns);
            }
        }
        this.u30(constantPool.multinames.length);
        for (let multiname of constantPool.multinames) {
            this.u8(multinameInfoKindValue(multiname));
            if (multiname instanceof abc.QNameMultinameInfo) {
                this.u30(multiname.ns);
                this.u30(multiname.name);
            } else if (multiname instanceof abc.RTQNameMultinameInfo) {
                this.u30(multiname.name);
            } else if (multiname instanceof abc.RTQNameLMultinameInfo) {
                // empty
            } else if (multiname instanceof abc.MultinameMultinameInfo) {
                this.u30(multiname.name);
                this.u30(multiname.nsSet);
            } else if (multiname instanceof abc.MultinameLMultinameInfo) {
                this.u30(multiname.nsSet);
            } else {
                throw new Error('Missing multiname kind.');
            }
        }
    }

    methodInfo(method: abc.MethodInfo) {
        this.u30(method.paramCount);
        this.u30(method.returnType);
        if (method.paramCount != method.paramTypes.length) {
            throw new Error('Inconsistent count of parameters in method info.');
        }
        for (let type of method.paramTypes) {
            this.u30(type);
        }
        this.u30(method.name);
        method.flags |= method.paramNames == null ? 0 : abc.MethodInfoFlags.HAS_PARAM_NAMES;
        method.flags |= method.options == null ? 0 : abc.MethodInfoFlags.HAS_OPTIONAL;
        this.u8(method.flags);
        if ((method.flags & abc.MethodInfoFlags.HAS_OPTIONAL) != 0) {
            assert(method.options != null, 'methodInfo.options is null.');
            this.u30(method.options.length);
            for (let opt of method.options) {
                this.constantValue(opt.value, false);
            }
        }
        if ((method.flags & abc.MethodInfoFlags.HAS_PARAM_NAMES) != 0) {
            assert(method.paramNames != null, 'methodInfo.paramNames is null.');
            assert(method.paramCount == method.paramNames.length, 'Inconsistent count of parameters in method info.');
            for (let name of method.paramNames) {
                this.u30(name);
            }
        }
    }

    constantValue(value: abc.ConstantValue, ignoreKindIfValueIsZero: boolean) {
        this.u30(value.value);
        if (ignoreKindIfValueIsZero ? value.value != 0 : true) {
            this.u8(constantValueKindValue.get(value.kind));
        }
    }

    metadataInfo(metadata: abc.MetadataInfo) {
        this.u30(metadata.name);
        this.u30(metadata.items.length);
        for (let item of metadata.items) {
            this.u30(item.key);
            this.u30(item.value);
        }
    }

    classInfo(classInfo: abc.ClassInfo) {
        unimplemented();
    }

    scriptInfo(script: abc.ScriptInfo) {
        unimplemented();
    }

    methodBodyInfo(methodBody: abc.MethodBodyInfo) {
        unimplemented();
    }

    add() {
        this.u8(0xA0);
    }
}

const namespaceInfoKindValue: Map<abc.NamespaceInfoKind, number> = new Map([
    ['namespace', 0x08],
    ['packageNamespace', 0x16],
    ['packageInternalNs', 0x17],
    ['protectedNamespace', 0x18],
    ['explicitNamespace', 0x19],
    ['staticProtectedNs', 0x1A],
    ['privateNs', 0x05],
]);

const constantValueKindValue: Map<abc.ConstantValueKind, number> = new Map([
    ['int', 0x03],
    ['uint', 0x04],
    ['double', 0x06],
    ['utf8', 0x01],
    ['true', 0x08],
    ['false', 0x0A],
    ['null', 0x0C],
    ['undefined', 0x00],
    ['namespace', 0x08],
    ['packageNamespace', 0x16],
    ['packageInternalNs', 0x17],
    ['protectedNamespace', 0x18],
    ['explicitNamespace', 0x19],
    ['staticProtectedNs', 0x1A],
    ['privateNs', 0x05],
]);

function multinameInfoKindValue(object: abc.MultinameInfo): number {
    return (
        object instanceof abc.QNameMultinameInfo ? (object.isAttribute ? 0x00 : 0x07) :
        object instanceof abc.RTQNameMultinameInfo ? (object.isAttribute ? 0x10 : 0x0F) :
        object instanceof abc.RTQNameLMultinameInfo ? (object.isAttribute ? 0x12 : 0x11) :
        object instanceof abc.MultinameMultinameInfo ? (object.isAttribute ? 0x0E : 0x09) :
        object instanceof abc.MultinameLMultinameInfo ? (object.isAttribute ? 0x1C : 0x1B) : 0
    );
}
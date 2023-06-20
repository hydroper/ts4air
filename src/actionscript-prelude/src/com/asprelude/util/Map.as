package com.asprelude.util
{
    import flash.utils.Dictionary;
    import flash.utils.Proxy;
    import flash.utils.flash_proxy;

    public final class Map extends Proxy
    {
        /**
         * @private
         */
        internal var m_keys:Vector.<*> = new Vector.<*>;
        /**
         * @private
         */
        internal var m_values:Vector.<*> = new Vector.<*>;

        public function Map(argumentValue:* = undefined)
        {
            var v:*;

            if (argumentValue is Array)
            {
                for each (v in argumentValue)
                {
                    if (v is Array)
                    {
                        this.m_keys.push(v[0]);
                        this.m_values.push(v[1]);
                    }
                    else
                    {
                        throw new ArgumentError('Invalid argument given to Map constructor.');
                    }
                }
            }
            else if (argumentValue is Map)
            {
                m_keys = Map(argumentValue).m_keys.slice(0);
                m_values = Map(argumentValue).m_values.slice(0);
            }
            /*
            else if (argumentValue is WeakMap)
            {
                const weakMap: WeakMap = WeakMap(argumentValue);
                for (v in weakMap.m_dict)
                {
                    m_keys.push(v);
                    m_keys.push(weakMap.m_dict[v]);
                }
            }
            */
            else if (argumentValue is Dictionary)
            {
                var dict:Dictionary = Dictionary(argumentValue);
                for (v in dict)
                {
                    this.m_keys.push(v);
                    this.m_values.push(dict[v]);
                }
            }
            else if (!!argumentValue && argumentValue.constructor == Object)
            {
                for (v in argumentValue)
                {
                    this.m_keys.push(v);
                    this.m_values.push(argumentValue[v]);
                }
            }
            else if (argumentValue !== undefined)
            {
                throw new ArgumentError('Invalid argument given to Map constructor.');
            }
        }

        public function get size():Number
        {
            return m_keys.length;
        }

        public function clear():void
        {
            m_keys.length = 0;
            m_values.length = 0;
        }

        public function get(key:*):*
        {
            var i:Number = this.m_keys.indexOf(key);
            return i == -1 ? undefined : this.m_values[i];
        }

        public function set(key:*, value:*):Map
        {
            var i:Number = this.m_keys.indexOf(key);
            if (i == -1)
            {
                this.m_keys.push(key);
                this.m_values.push(value);
            }
            else
            {
                this.m_values[i] = value;
            }
            return this;
        }

        public function deleteKey(key:*):Boolean
        {
            var i:Number = this.m_keys.indexOf(key);
            if (i == -1)
            {
                return false;
            }
            this.m_keys.removeAt(i);
            this.m_values.removeAt(i);
            return true;
        }

        public function has(key:*):Boolean
        {
            return this.m_keys.indexOf(key) != -1;
        }

        public function entries():MapEntriesIterator
        {
            return new MapEntriesIterator(this);
        }

        public function keys():MapKeysIterator
        {
            return new MapKeysIterator(this);
        }

        public function values():MapValuesIterator
        {
            return new MapValuesIterator(this);
        }

        public function forEach(callback:Function):void
        {
            for (var i:uint = 0; i < this.m_keys.length; ++i)
            {
                callback(this.m_values[i], this.m_keys[i], this);
            }
        }

        override flash_proxy function nextNameIndex(index:int):int
        {
            if (index < m_keys.length)
            {
                return index + 1;
            }
            else
            {
                return 0;
            }
        }

        override flash_proxy function nextName(index:int):String
        {
            return String(m_keys[index - 1]);
        }

        override flash_proxy function nextValue(index:int):*
        {
            index -= 1;
            return [m_keys[index], m_values[index]];
        }

        public function toPlainObject():*
        {
            var r:* = {};
            for each (var entry:Array in this.entries())
            {
                r[entry[0]] = entry[1];
            }
            return r;
        }

        public function toFlashDictionary():Dictionary
        {
            var r:Dictionary = new Dictionary;
            for each (var entry:Array in this.entries())
            {
                r[entry[0]] = entry[1];
            }
            return r;
        }
    }
}
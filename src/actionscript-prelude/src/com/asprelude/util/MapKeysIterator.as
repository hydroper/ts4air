package com.asprelude.util
{
    /**
     * @private
     */
    public final class MapKeysIterator
    {
        private var m_map:Map = null;
        private var m_index:uint = 0;

        public function MapKeysIterator(map:Map)
        {
            m_map = map;
        }
        
        public function next():* {
            if (this.m_index >= this.m_map.m_keys.length)
            {
                return {done: true, value: undefined};
            }
            ++this.m_index;
            return {done: false, value: this.m_map.m_keys[this.m_index - 1]};
        }
    }
}
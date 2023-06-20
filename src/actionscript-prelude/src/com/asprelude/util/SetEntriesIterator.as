package com.asprelude.util
{
    /**
     * @private
     */
    public final class SetEntriesIterator
    {
        private var m_set:Set = null;
        private var m_index:uint = 0;

        public function SetEntriesIterator(set:Set)
        {
            m_set = set;
        }

        public function next():* {
            if (this.m_index >= this.m_set.m_values.length)
            {
                return {done: true, value: undefined};
            }
            const v:* = this.m_set.m_values[this.m_index++];
            return {done: false, value: [v, v]};
        }
    }
}
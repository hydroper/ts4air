package com.asprelude.util
{
    /**
     * @private
     */
    public final class SetValuesIterator
    {
        private var m_set:Set = null;
        private var m_index:uint = 0;

        public function SetValuesIterator(set:Set)
        {
            m_set = set;
        }

        public function next():* {
            if (this.m_index >= this.m_set.m_values.length)
            {
                return {done: true, value: undefined};
            }
            ++this.m_index;
            return {done: false, value: this.m_set.m_values[this.m_index - 1]};
        }
    }
}
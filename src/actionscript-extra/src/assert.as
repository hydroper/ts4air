package
{
    public function assert(test:*, errorMessage:String = ''):void
    {
        if (!test) throw new AssertionError(errorMessage || 'Assertion failed');
    }
}
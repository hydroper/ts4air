package
{
    public function assertEquals(left:*, right:*, errorMessage:String = ''):void
    {
        if (left != right) throw new AssertionError(errorMessage || 'Assertion failed');
    }
}
package
{
    public function assertNeq(left:*, right:*, errorMessage:String = ''):void
    {
        if (left == right) throw new AssertionError(errorMessage || ('Assertion failed; arguments must differ: ' + String(left) + ', ' + String(right)));
    }
}
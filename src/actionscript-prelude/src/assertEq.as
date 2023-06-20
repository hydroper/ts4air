package
{
    public function assertEq(left:*, right:*, errorMessage:String = ''):void
    {
        if (left != right) throw new AssertionError(errorMessage || ('Assertion failed; arguments must be equal: ' + String(left) + ', ' + String(right)));
    }
}
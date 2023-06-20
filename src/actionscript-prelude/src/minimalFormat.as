package
{
    import com.asprelude.util.Map;

    public function minimalFormat(base:String, argumentsObject:*):String
    {
        // argumentsObject = argumentsObject ?? {};
        argumentsObject = argumentsObject !== undefined && argumentsObject !== null ? argumentsObject : {};
        if (argumentsObject is Array)
        {
            var array:Array = argumentsObject;
            argumentsObject = {};
            var i:Number = 0;
            for each (var v:* in array)
            {
                argumentsObject[(++i).toString()] = v;
            }
        }
        else if (argumentsObject is Map)
        {
            argumentsObject = Map(argumentsObject).toPlainObject();
        }
        return base.replace(/\$([a-z0-9]+|\<[a-z0-9\-_]+\>|\$)/gi, function(_:*, s:String, ..._):String
        {
            return s == '$' ? '$' : String(argumentsObject[s.replace('<', '').replace('>', '')]);
        });
    }
}
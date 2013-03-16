function mLog (message)
{
    if(console && console.log)
    {
        console.log.apply(console,arguments);
    }
    else
    {
        window.mLog = $.noop;
    }
}

function fatalError (error)
{
    throw(error);
}

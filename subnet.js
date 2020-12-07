
//Global and central variable to store the user input
var g_Octets = new Array( 0, 0, 0, 0 );


//////////////////////////////// Event handler ////////////////////////////////
//
//onload event handler. Triggered once the website has finished loading.
function onBodyLoad()
{
    //the decimal IPv4 is set by default
    //trigger an update so all other fields are updated accordingly
    onIPv4Input();
}
//
//oninput event handler for input field "IPv4NetworkMaskCIDR"
function updateIPv4NetworkMask() 
{
    updateSubnetTable( );
    updateIPv4InputBitArray( );
    updateIPv4Info( );
}
//
//oninput event handler for input field "IPv4SubnetBits"
function updateIPv4SubnetBits()
{
    //Update the table using the new amount of subnet bits
    updateSubnetTable();
}
//
//oninput event handler for input field "IPv4DecInput"
function onIPv4Input()
{
    //Read in new Decimal IP:
    var strInput = document.getElementById("IPv4DecInput").value;
    var dotPositions = new Array();

    for( var i = 0; i < strInput.length; i++ )
	{
        var c = strInput.charAt( i );
        if ( c == '.' )
            dotPositions.push(i);
    }

    var Octets = new Array( 0, 0, 0, 0 );

    if ( dotPositions.length > 0 && dotPositions[0] > 0 )
        Octets[0] = readInOctet( strInput, 0, dotPositions[0] );
    
    if ( dotPositions.length > 1 && dotPositions[1] > 2 )
        Octets[1] = readInOctet( strInput, dotPositions[0], dotPositions[1] );
    
    if ( dotPositions.length > 2 && dotPositions[2] > 4 )
        Octets[2] = readInOctet( strInput, dotPositions[1], dotPositions[2] );

    if ( dotPositions.length > 2 && dotPositions[2] > 4 )
        Octets[3] = readInOctet( strInput, dotPositions[2], strInput.length );
    

    //Update global octets store
    g_Octets = Octets;

    //Update all other input methods to display the new IP
    updateIPv4BinaryFields(  );
    updateIPv4InputBitArray(  );

    //Update the subnetwork table
    updateSubnetTable();

    //Updat the IP information box:
    updateIPv4Info();
}
//
//oninput event handler for input fields [ "IPv4BinInput_Octet0", "IPv4BinInput_Octet1", "IPv4BinInput_Octet2", "IPv4BinInput_Octet3" ]
function onIPv4InputBinary()
{
    //Read in new binary IP:
    var Octet0 = document.getElementById("IPv4BinInput_Octet0").value;
    var Octet1 = document.getElementById("IPv4BinInput_Octet1").value;
    var Octet2 = document.getElementById("IPv4BinInput_Octet2").value;
    var Octet3 = document.getElementById("IPv4BinInput_Octet3").value;

    var Octets = new Array( 0, 0, 0, 0 );
 
    if ( Octet0 && Octet0 != "" )
        Octets[0] = parseInt(Octet0,2);
    
    if ( Octet1 && Octet1 != "" )
        Octets[1] = parseInt(Octet1,2);
    
    if ( Octet2 && Octet2 != "" )
        Octets[2] = parseInt(Octet2,2);

    if ( Octet3 && Octet3 != "" )
        Octets[3] = parseInt(Octet3,2);

    //Update global octets store
    g_Octets = Octets;

    //Update all other input methods to display the new IP
    updateIPv4Field( );
    updateIPv4InputBitArray( );

    //Update the subnetwork table
    updateSubnetTable();

    //Updat the IP information box:
    updateIPv4Info();
}
//
//onclick event handler for bit array entries "Bit0" - "Bit31"
function onclickIPv4InputBitArrayElement( BitID )
{
    var Element = document.getElementById("Bit"+BitID);

    var currentValue = Element.innerHTML;

    if ( currentValue == '0' )
    {
        Element.innerHTML = '1';
        Element.style.color = "blue";
    }
    else
    {
        Element.innerHTML = '0';
        Element.style.color = "";
    }
    var Octets = new Array( 0, 0, 0, 0 );

    for( var j = 0; j < Octets.length; j++ ) 
    {
        var OctetText = "";
        for( var i = 0; i < 8; i++ )
        {
            const ID = i + j*8;
            var Element = document.getElementById("Bit"+ ID );
            OctetText += Element.innerHTML;
        }
        Octets[j] = parseInt(OctetText,2);
        document.getElementById("IPv4BinInput_Octet"+j).value = OctetText;
    }

    //Update global octets store
    g_Octets = Octets;

    //Update all other input methods to display the new IP
    updateIPv4Field( );
    updateIPv4BinaryFields(  );

    //Update the subnetwork table
    updateSubnetTable();

    //Updat the IP information box:
    updateIPv4Info();
}
///////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------------*/

//////////////////////////////// Update inputs ////////////////////////////////
//
//Updat the input fields [ "IPv4BinInput_Octet0", "IPv4BinInput_Octet1", "IPv4BinInput_Octet2", "IPv4BinInput_Octet3" ]
function updateIPv4BinaryFields( )
{
    document.getElementById("IPv4BinInput_Octet0").value = NumberToBinaryString(g_Octets[0]);
    document.getElementById("IPv4BinInput_Octet1").value = NumberToBinaryString(g_Octets[1]);
    document.getElementById("IPv4BinInput_Octet2").value = NumberToBinaryString(g_Octets[2]);
    document.getElementById("IPv4BinInput_Octet3").value = NumberToBinaryString(g_Octets[3]);
}
//
//Update the decimal IP input field
function updateIPv4Field()
{
    document.getElementById("IPv4DecInput").value = ""+g_Octets[0]+"."+g_Octets[1]+"."+g_Octets[2]+"."+g_Octets[3];
}
//
//Update the bit input array
function updateIPv4InputBitArray( )
{
    var IPv4NetworkMaskCIDR = parseInt(document.getElementById("IPv4NetworkMaskCIDR").value);

    for( var j = 0; j < g_Octets.length; j++ )
    {
        const Octet = NumberToBinaryString(g_Octets[j]);
        for( var i = 0; i < Octet.length; i++ )
        {
            const BitID = i + j*8;

            var Element = document.getElementById("Bit"+BitID);
            if ( Octet[i] == '1' )
            {
                Element.innerHTML = '1';
                Element.style.color = "blue";
            }
            else
            {
                Element.innerHTML = '0';
                Element.style.color = "";
            }

            if ( BitID >= IPv4NetworkMaskCIDR )
            {
                //Element.style.borderTop = "thick solid black";
                Element.style.borderBottom = "thick solid darkolivegreen";
            }
            else
            {
                Element.style.borderTop = "";
                Element.style.borderBottom = "thick solid chocolate";
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------------*/

///////////////////////////// Update Information //////////////////////////////
//
//Update information about IP
function updateIPv4Info()
{
    var IPv4NetworkMaskCIDR = parseInt(document.getElementById("IPv4NetworkMaskCIDR").value);
    if ( IPv4NetworkMaskCIDR < 1 || IPv4NetworkMaskCIDR > 32 )
        return;
    
    const TotalHostBits = 32-IPv4NetworkMaskCIDR;

    var IpBinaryText = "";
    for( var j = 0; j < 4; j++ ) 
        IpBinaryText += NumberToBinaryString( g_Octets[j] );

    
    //cut the network bits from the whole IP
    const NetworkPart = IpBinaryText.slice(0,IPv4NetworkMaskCIDR);

    //append zeros to the network bits to get a valid address again:
    const NetworkIpBin = NetworkPart.padEnd(32,'0');
    
    //covert it into the decimal dot notation:
    const NetworkIpDec = getIpFromBinary(NetworkIpBin);

    const NetworkStartIpBin = NetworkPart + "1".padStart(TotalHostBits,'0');
    const NetworkStartEndBin = NetworkPart + "0".padStart(TotalHostBits,'1');
    const NetworkBroadcastAddressBin = NetworkPart + "1".padStart(TotalHostBits,'1');

    const NetworkStartIpDec = getIpFromBinary(NetworkStartIpBin);
    const NetworkStartEndDec = getIpFromBinary(NetworkStartEndBin);
    const NetworkBroadcastAddressDec = getIpFromBinary(NetworkBroadcastAddressBin);

    var NetworkAddress = NetworkIpDec + "/" + IPv4NetworkMaskCIDR;

    var NetworkOctets = getIpArrayFromBinary( NetworkIpBin );
    const WarningMsg = getNetworkReservationWarning(NetworkOctets);
    if ( WarningMsg )
        NetworkAddress += "<br>"+WarningMsg+"<br>";

    document.getElementById("NetworkAddress").innerHTML = NetworkAddress
    document.getElementById("NetworkStartAddress").innerHTML = NetworkStartIpDec + "/" + IPv4NetworkMaskCIDR;
    document.getElementById("NetworkEndAddress").innerHTML = NetworkStartEndDec + "/" + IPv4NetworkMaskCIDR;
    document.getElementById("NetworkBroadcastAddress").innerHTML = NetworkBroadcastAddressDec + "/" + IPv4NetworkMaskCIDR;

    document.getElementById("NetworkBits").innerHTML = IPv4NetworkMaskCIDR;
    document.getElementById("HostBits").innerHTML = TotalHostBits;
    document.getElementById("NetworkMaxClientNbr").innerHTML = Math.pow( 2, TotalHostBits ) - 2;
}
//
//Update subnetting table:
function updateSubnetTable()
{
    //Get table element
    var table = document.getElementById("SubnetTable");

    //Remove old table rows
    for (var i = table.rows.length - 1; i > 0; i--) 
        table.deleteRow(i);


    //Empty old values:
    document.getElementById("HostsPerSubnet").innerHTML = '';
    document.getElementById("NumberOfSubnets").innerHTML = '';

    
    var SubnetBits = parseInt(document.getElementById("IPv4SubnetBits").value);
    //console.log("SubnetBits: "+SubnetBits); 
    if ( SubnetBits < 1 || SubnetBits > 32 )
        return; //Invalid user input. Quit.

    var IPv4NetworkMaskCIDR = parseInt(document.getElementById("IPv4NetworkMaskCIDR").value);
    //console.log("IPv4NetworkMaskCIDR: "+IPv4NetworkMaskCIDR); 
    if ( IPv4NetworkMaskCIDR < 1 || IPv4NetworkMaskCIDR > 32 )
        return; //Invalid user input. Quit.

    var TotalNetworkBits = IPv4NetworkMaskCIDR + SubnetBits;
    //console.log("TotalNetworkBits: "+TotalNetworkBits); 
    if ( TotalNetworkBits < 1 || TotalNetworkBits > 32 )
        return; //Invalid user input. Quit.

    var TotalHostBits = 32-TotalNetworkBits;

    document.getElementById("HostsPerSubnet").innerHTML = Math.pow( 2, TotalHostBits ) - 2;
    document.getElementById("NumberOfSubnets").innerHTML = Math.pow( 2, SubnetBits );

    var IpBinaryText = "";
    for( var j = 0; j < 4; j++ ) 
        IpBinaryText += NumberToBinaryString( g_Octets[j] );
    
    //Cut the network bits from the binary address string:
    var NetworkPart = IpBinaryText.slice(0,IPv4NetworkMaskCIDR);

    //calculate the amount of subnetworks
    const NumberOfSubnets = parseInt(Math.pow(2,SubnetBits));

    //In case there are more than 512 subnetworks: 
    //how much does i need to be increamented to reach the end in 8 iterations
    const SplitIncrease = ( NumberOfSubnets > 512 ) ? ((NumberOfSubnets - 512) / 8) : 0;


    for( var i = 0; i < NumberOfSubnets; i++ )
    {
        if ( i > 512 )
            i += SplitIncrease - 1;

        //Representation of the Subnet id in binary. Padded with zeros.
        var SubnetNumber = i.toString(2).padStart(SubnetBits,'0');

        var HostZeros = "".padStart(TotalHostBits,'0');
        var HostOnes  = "".padStart(TotalHostBits,'1');

        //String for calculation of IP in decimal:
        var SubnetIpBin = ((NetworkPart + SubnetNumber)).padEnd(32,'0');

        //String to display IP:
       var SubnetIpBinHTML = getHTMLDotedBinaryIP( NetworkPart, SubnetNumber, HostZeros );

        //Calculate decimal IP from binary IP string:
        var SubnetIpString = getIpFromBinary(SubnetIpBin);


        //First IP in the Subnet
        var firstHostIpBin = (NetworkPart + SubnetNumber) + "1".padStart(TotalHostBits,'0');
        var firstHostIp = getIpFromBinary(firstHostIpBin);

        //Last IP in the Subnet
        var lastHostIpBin = (NetworkPart + SubnetNumber) + "0".padStart(TotalHostBits,'1');
        var lastHostIp = getIpFromBinary(lastHostIpBin);

        //String for calculation of Broadcast IP in decimal:
        var BroadcastIpBin = ((NetworkPart + SubnetNumber)).padEnd(32,'1');

        //String to display Broadcast IP:
        var BroadcastIpBinHTML = getHTMLDotedBinaryIP( NetworkPart, SubnetNumber, HostOnes );

        var BroadcastIp = getIpFromBinary(BroadcastIpBin);

        //Any subnetwork needs at least 2 bit ;)
        if ( TotalHostBits < 2 )
        {
            //IP Addresses are Invalid. Mark them in different color!
            firstHostIp = "<span id='colorInvalidIP'>"+firstHostIp+"</span>";
            lastHostIp = "<span id='colorInvalidIP'>"+lastHostIp+"</span>";
            BroadcastIp = "<span id='colorInvalidIP'>"+BroadcastIp+"</span>";
        }

        //append a row at the end of the table:
        var row = table.insertRow(-1);

        //insert columns into the row:
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        var c3 = row.insertCell(2);
        var c4 = row.insertCell(3);

        //fill the columns with information:
        c1.innerHTML = i;
        c2.innerHTML = SubnetIpString+"/"+TotalNetworkBits+"<br>"+SubnetIpBinHTML;
        c3.innerHTML = firstHostIp+"<br>"+lastHostIp;
        c4.innerHTML = BroadcastIp+"<br>"+BroadcastIpBinHTML;
    }
}
//
//get the IP as binary but with dot-speration and subnet & host highlighting
function getHTMLDotedBinaryIP(NetworkPart, SubnetPart, HostPart)
{
    /*// old code:
    var SubnetIpBinHTML = NetworkPart + 
    "<span id='colorSubnet'>"+SubnetNumber+"</span>"+
    "<span id='colorHost'>"+HostZeros+"</span>";
    */

    const NetworkPartLength = NetworkPart.length;

    const SubnetPartStart = NetworkPartLength;
    const HostPartStart = SubnetPartStart + SubnetPart.length;

    var TotalIP = NetworkPart + SubnetPart + HostPart;

    const charArray = TotalIP.split('');

    var strOutput = "";
    for( var j = 0; j < charArray.length; j++ )
    { 
        if ( j )
        {
            if ( (j % 8) == 0 )
                strOutput += "<b>.</b>";
            else
            if ( (j % 4) == 0 )
                strOutput += "'";
        }
        if ( j == SubnetPartStart )
            strOutput += "<span id='colorSubnet'>";
        else
        if ( j == HostPartStart )
            strOutput += "</span><span id='colorHost'>";

        strOutput += charArray[j];
    }

    strOutput += "</span>";

    return strOutput;
}
//
function getNetworkReservationWarning( NetworkOctets )
{
    var Output = false;

    //Information source:
    //https://en.wikipedia.org/wiki/Reserved_IP_addresses#IPv4
    
    //"0.0.0.0/8"
    if ( NetworkOctets[0] == 0 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 0.0.0.0 – 0.255.255.255 ] is reserved for use in software only!</span>";
    else
    //"127.0.0.0/8"
    if ( NetworkOctets[0] == 127 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 127.0.0.0–127.255.255.255 ] is reserved for use as loopback addresses to the local host!</span>";
    else
    //"10.0.0.0/8"
    if ( NetworkOctets[0] == 10 ) 
        Output = "Note: IP address space [ 10.0.0.0 – 10.255.255.255 ] can only be used for private networks!";
    else
    //"169.254.0.0/16"
    if ( NetworkOctets[0] == 169 && NetworkOctets[1] == 254 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 169.254.0.0 – 169.254.255.255 ] is reserved for link-local addresses between two hosts on a single link when no IP address is otherwise specified, such as would have normally been retrieved from a DHCP server!</span>";
    else
    //"192.0.0.0/24"
    if ( NetworkOctets[0] == 192 && NetworkOctets[1] == 0 && NetworkOctets[2] == 0 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 192.0.0.0 – 192.0.0.255 ] is reserved for IETF Protocol Assignments</span>";
    else
    //"192.0.2.0/24"
    if ( NetworkOctets[0] == 192 && NetworkOctets[1] == 0 && NetworkOctets[2] == 2 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 192.0.2.0 – 192.0.2.255  ] is reserved as TEST-NET-1, documentation and examples</span>";
    else
    //"192.88.99.0/24"
    if ( NetworkOctets[0] == 192 && NetworkOctets[1] == 88 && NetworkOctets[2] == 99 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 192.88.99.0 – 192.88.99.255 ] is reserved. Formerly used for IPv6 to IPv4 relay (included IPv6 address block 2002::/16). </span>";
    else
    //"192.168.0.0/16"
    if ( NetworkOctets[0] == 192 && NetworkOctets[1] == 168 ) 
        Output = "Note: This IP address space [ 192.168.0.0 – 192.168.255.255 ] can only be used for private networks!";
    else
    //"198.18.0.0/15"
    if ( NetworkOctets[0] == 198 && NetworkOctets[1] >= 18 && NetworkOctets[1] <= 19 ) 
        Output = "Note: This IP address space [ 198.18.0.0 – 198.19.255.255 ] is reserved for benchmark testing of inter-network communications between two separate subnets!";
    else
    //"172.16.0.0/12"
    if ( NetworkOctets[0] == 172 && NetworkOctets[1] >= 16 && NetworkOctets[1] <= 31) 
        Output = "Note: This IP address space [ 172.16.0.0 – 172.31.255.255 ] can only be used for private networks!";
    else
    //"100.64.0.0/10"
    if ( NetworkOctets[0] == 100 && NetworkOctets[1] >= 64 && NetworkOctets[1] <= 127) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 100.64.0.0 – 100.127.255.255 ] is a shared address space for communications between a service provider and its subscribers when using a carrier-grade NAT.</span>";
    else
    //"198.51.100.0/24"
    if ( NetworkOctets[0] == 198 && NetworkOctets[1] == 51 && NetworkOctets[2] == 100 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 198.51.100.0 – 198.51.100.255 ] is assigned as TEST-NET-2, documentation and examples</span>";
    else
    //"203.0.113.0/24"
    if ( NetworkOctets[0] == 203 && NetworkOctets[1] == 0 && NetworkOctets[2] == 113 ) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 203.0.113.0 – 203.0.113.255  ] is assigned as TEST-NET-3, documentation and examples</span>";
    else
    //"224.0.0.0/4"
    if ( NetworkOctets[0] >= 224 && NetworkOctets[0] <= 239) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 224.0.0.0 – 239.255.255.255 ] is reserved for IP multicast</span>";
    else
    //"240.0.0.0/4"
    if ( NetworkOctets[0] >= 240 && NetworkOctets[0] <= 255) 
        Output = "<span id='IpWarning'>Warning: IP address space [ 240.0.0.0 – 255.255.255.254] is reserved for future use</span>";

    return Output;
}
///////////////////////////////////////////////////////////////////////////////

/*---------------------------------------------------------------------------*/

//////////////////////////////// Utility functions ////////////////////////////////
function NumberToBinaryString( number )
{
    /*
    var BinaryString = "";

    var i = number;

    while( i > 0 )
    {
        if ( (i % 2) == 1 )
            BinaryString = "1"+BinaryString;
        else
            BinaryString = "0"+BinaryString;

        i = parseInt(i / 2);
    }
    return BinaryString;
    */
    
   return number.toString(2).padStart(8,'0');
}

function NumberToBinaryArray( number )
{
   var numberString = number.toString(2).padStart(8,'0');

   const charArray = NumberString.split('');

   return charArray;
}

function readInOctet( strInput, StartPos, EndPos )
{
    if ( StartPos != 0 )
         StartPos += 1;

    var Lenght = EndPos - StartPos;
    if ( Lenght < 1 )
        return 0;

    var Octet = strInput.substring(StartPos,EndPos);

    if ( Octet === false || Octet == "")
        return 0;
    
    var result = parseInt( Octet );
    if ( result > 255 || result < 0 )
        return 0;
    
    return result;
}
function getIpFromBinary(BinaryString)
{
    
    var strInput = BinaryString.padStart(32,'0');
    
    var strOutput = "";
    for( var j = 0; j < 4; j++ )
    {
        var Octet = strInput.substring( 8*j, 8*(j+1) );
        
        
        strOutput += ( j == 0 ? "" : "." ) + parseInt(Octet,2);
    }
    return strOutput;
}

function getIpArrayFromBinary(BinaryString)
{
    
    var strInput = BinaryString.padStart(32,'0');
    
    var result = new Array(0,0,0,0);
    for( var j = 0; j < 4; j++ )
    {
        var Octet = strInput.substring( 8*j, 8*(j+1) );
        
        
        result[j] = parseInt(Octet,2);
    }
    return result;
}
///////////////////////////////////////////////////////////////////////////////////

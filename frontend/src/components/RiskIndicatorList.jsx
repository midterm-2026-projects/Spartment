export default function RiskIndicatorList({
indicators=[]
}){


return (

<div className="bg-white rounded-xl shadow p-5">


<h2 className="font-bold text-lg mb-3">
Risk Indicators
</h2>



{

indicators.length > 0 ?


<ul className="list-disc ml-5">


{
indicators.map(
(item,index)=>(


<li key={index}>
{item}
</li>


)
)

}


</ul>



:

<p>
No risk indicators found.
</p>


}



</div>

);

}
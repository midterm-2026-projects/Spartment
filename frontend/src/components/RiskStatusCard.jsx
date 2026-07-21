export default function RiskStatusCard({
risk
}){


if(!risk){

return null;

}




const styles = {


Low:
"bg-green-100 text-green-700",


Medium:
"bg-yellow-100 text-yellow-700",


High:
"bg-red-100 text-red-700",


};





return (

<div className="bg-white rounded-xl shadow p-5">


<h2 className="font-bold text-lg">
Tenant Risk Status
</h2>




<div
className={`mt-4 px-4 py-2 rounded-lg font-bold ${
styles[risk.riskLevel]
}`}
>


{risk.riskLevel} Risk


</div>





</div>

);


}
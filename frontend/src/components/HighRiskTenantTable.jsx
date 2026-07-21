export default function HighRiskTenantTable({
tenants=[]
}){


return (

<div className="bg-white rounded-xl shadow p-6">


<h2 className="font-bold text-xl mb-4">
High Risk Tenants
</h2>



<table className="w-full">


<thead>

<tr>

<th>
Tenant ID
</th>


<th>
Risk Level
</th>


<th>
Late Payments
</th>


<th>
Balance
</th>


</tr>

</thead>





<tbody>


{

tenants.length > 0 ?


tenants.map(
(tenant)=>(


<tr key={tenant.id}>


<td>
{tenant.tenantId}
</td>


<td className="text-red-600 font-bold">
{tenant.riskLevel}
</td>


<td>
{tenant.latePayments}
</td>


<td>
₱{tenant.unpaidBalance}
</td>



</tr>


)

)



:

<tr>

<td colSpan="4"
className="text-center">

No high-risk tenants.

</td>

</tr>


}



</tbody>


</table>


</div>

);


}
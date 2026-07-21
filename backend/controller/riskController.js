import {
  analyzeTenantRisk,
  getHighRiskTenants,
} from "../service/riskService.js";





/*
|--------------------------------------------------------------------------
| Analyze Tenant Risk
|--------------------------------------------------------------------------
|
| Retrieves tenant payment history,
| analyzes late payments,
| checks unpaid balances,
| generates risk level and indicators.
|
| Example:
|
| GET /api/risk/tenant/:tenantId
|
|--------------------------------------------------------------------------
*/


export const analyzeTenantRiskController = async (
  req,
  res
) => {


  try {


    const {
      tenantId
    } = req.params;



    if(!tenantId){


      return res.status(400).json({

        message:
          "Tenant ID is required."

      });


    }




    const risk =

      await analyzeTenantRisk(

        tenantId

      );





    return res.status(200).json({


      message:
        "Tenant risk analysis completed successfully.",


      data:
        risk



    });





  } catch(error){



    return res.status(500).json({


      message:
        error.message


    });


  }


};









/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
|
| Returns tenants classified as High Risk.
|
| Example:
|
| GET /api/risk/high-risk
|
|--------------------------------------------------------------------------
*/


export const getHighRiskTenantList = async (
  req,
  res
) => {


  try {


    const tenants =

      await getHighRiskTenants();




    return res.status(200).json({


      message:
        "High-risk tenants retrieved successfully.",


      data:
        tenants



    });




  } catch(error){


    return res.status(500).json({


      message:
        error.message


    });


  }


};
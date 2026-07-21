import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";



/*
|--------------------------------------------------------------------------
| Mock Tenant Model
|--------------------------------------------------------------------------
*/

vi.mock(
  "../model/tenantModel.js",
  () => ({

    getTenantByEmail:
      vi.fn(),

    createTenant:
      vi.fn(),

  })
);




/*
|--------------------------------------------------------------------------
| Mock Billing Service
|--------------------------------------------------------------------------
*/

vi.mock(
  "../service/billingService.js",
  () => ({

    generateBilling:
      vi.fn(),

  })
);





import {

  createTenantAccount,

} from "../service/tenantService.js";



import {

  getTenantByEmail,

  createTenant,

} from "../model/tenantModel.js";



import {

  generateBilling,

} from "../service/billingService.js";







describe(
  "Tenant Billing Integration",
  () => {



    beforeEach(()=>{

      vi.clearAllMocks();

    });








    it(
      "should create tenant and generate initial billing successfully",
      async()=>{


        /*
        -------------------------
        Arrange
        -------------------------
        */


        getTenantByEmail
        .mockResolvedValue(
          null
        );



        createTenant
        .mockResolvedValue({

          id:101,

          fullName:
            "Juan Dela Cruz",

          email:
            "juan@gmail.com",

        });





        generateBilling
        .mockResolvedValue({

          id:1,

          tenantId:101,

          billingType:
            "initial",

          rentAmount:
            5000,

          waterBill:
            200,

          electricityBill:
            0,

          totalAmount:
            5200,

          status:
            "Pending",

        });







        /*
        -------------------------
        Act
        -------------------------
        */


        const result =

          await createTenantAccount({

            fullName:
              "Juan Dela Cruz",


            email:
              "juan@gmail.com",


            contact:
              "09123456789",


            room:
              "101",


            username:
              "juan101",


            password:
              "Tenant123",


          });








        /*
        -------------------------
        Assert
        -------------------------
        */


        expect(
          createTenant
        )
        .toHaveBeenCalledTimes(1);




        expect(
          generateBilling
        )
        .toHaveBeenCalledWith({

          tenantId:
            101,

          billingType:
            "initial",

        });





        expect(
          result.tenant.id
        )
        .toBe(101);




        expect(
          result.billing.totalAmount
        )
        .toBe(5200);




        expect(
          result.billing.status
        )
        .toBe(
          "Pending"
        );


      }

    );







    it(
      "should not create billing when tenant already exists",
      async()=>{


        /*
        Arrange
        */


        getTenantByEmail
        .mockResolvedValue({

          id:101,

          email:
            "juan@gmail.com",

        });







        /*
        Act + Assert
        */


        await expect(

          createTenantAccount({

            email:
              "juan@gmail.com",

          })

        )
        .rejects
        .toThrow(
          "Tenant already exists."
        );






        expect(
          generateBilling
        )
        .not
        .toHaveBeenCalled();


      }

    );





  }

);
import {
  useState
} from "react";


import {
  confirmPayment,
  getTenantPayments,
  getPaymentMetrics
} from "../api/paymentApi";




export default function usePayments() {


  const [
    payments,
    setPayments
  ] = useState([]);



  const [
    metrics,
    setMetrics
  ] = useState(null);



  const [
    loading,
    setLoading
  ] = useState(false);



  const [
    error,
    setError
  ] = useState(null);






  const fetchPayments = async (
    tenantId
  ) => {


    try {


      setLoading(true);


      setError(null);



      const response =
        await getTenantPayments(
          tenantId
        );



      setPayments(
        response.data
      );



      return response;



    } catch(error) {


      setError(
        error.message
      );


      throw error;



    } finally {


      setLoading(false);


    }


  };







  const approvePayment = async (
    paymentId
  ) => {


    try {


      const response =
        await confirmPayment(

          paymentId,

          {
            paymentMethod:
              "Cash"
          }

        );



      return response;



    } catch(error) {


      setError(
        error.message
      );


      throw error;



    }


  };








  const fetchMetrics = async () => {


    try {


      const response =
        await getPaymentMetrics();



      setMetrics(
        response.data
      );



      return response;



    } catch(error) {


      setError(
        error.message
      );


      throw error;



    }


  };







  return {


    payments,


    metrics,


    loading,


    error,


    fetchPayments,


    approvePayment,


    fetchMetrics,


  };


}
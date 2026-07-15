import {
  useEffect,
  useState,
} from "react";


import {
  getAnalytics,
} from "../api/analyticsApi";


import Loading from "../components/Loading";

import ErrorMessage from "../components/ErrorMessage";

import EmptyState from "../components/EmptyState";



export default function AnalyticsDashboard() {

  const [
    analytics,
    setAnalytics,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");



  useEffect(() => {

    async function loadAnalytics() {

      try {

        const data =
          await getAnalytics();


        setAnalytics(data);


      } catch(error) {

        setError(
          error.message
        );

      } finally {

        setLoading(false);

      }

    }


    loadAnalytics();

  }, []);



  if (loading) {
    return <Loading />;
  }


  if (error) {
    return (
      <ErrorMessage
        message={error}
      />
    );
  }


  if (!analytics) {
    return <EmptyState />;
  }



  return (

    <div>

      <h1>
        Analytics Dashboard
      </h1>


      <div>

        <h2>
          Total Revenue
        </h2>

        <p>
          ₱{analytics.totalRevenue}
        </p>


        <h2>
          Active Tenants
        </h2>

        <p>
          {analytics.totalTenants}
        </p>


        <h2>
          Occupancy Rate
        </h2>

        <p>
          {analytics.occupancyRate}%
        </p>


        <h2>
          Payment Status
        </h2>

        <p>
          Paid:
          {" "}
          {analytics.paymentStatus.paid}
        </p>

        <p>
          Pending:
          {" "}
          {analytics.paymentStatus.pending}
        </p>

        <p>
          Overdue:
          {" "}
          {analytics.paymentStatus.overdue}
        </p>


        <h2>
          Revenue Trend
        </h2>

        {
          analytics.revenueTrend.map(
            (item) => (
              <p
                key={item.month}
              >
                {item.month}
                :
                ₱{item.amount}
              </p>
            )
          )
        }


        <h2>
          Smart Recommendations
        </h2>

        {
          analytics.recommendations.map(
            (item, index) => (
              <p
                key={index}
              >
                {item.title}
                :
                {" "}
                {item.message}
              </p>
            )
          )
        }

      </div>

    </div>

  );

}
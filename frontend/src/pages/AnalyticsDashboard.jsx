import { useEffect, useMemo, useState } from "react";
import { getAnalytics } from "../api/analyticsApi";
import { getNotifications, updateNotification } from "../api/notificationApi";

const nav = [["Dashboard","/admin","▦"],["Rooms","/admin/rooms","♙"],["Tenants","/admin/tenants","♧"],["Billing","/billing","▣"],["Customer Requests","/customer-requests","□"],["Analytics & Reports","/analytics","⌑"]];
const money=(value)=>`₱${Number(value||0).toLocaleString()}`;
const label=(month)=>new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US",{month:"short",year:"2-digit"});
const colors={Occupied:"#2867ed",Available:"#12b76a",Vacant:"#12b76a",Reserved:"#f5b700",Maintenance:"#ef4444",Paid:"#12b76a",Unpaid:"#f5b700","Partially Paid":"#f59e0b",Overdue:"#ef4444",Cancelled:"#98a2b3"};
const normalizeAnalytics=(value={})=>({
  ...value,
  forecastRevenue:value.forecastRevenue??value.totalRevenue??0,
  variance:value.variance??0,
  occupancy:value.occupancy||{},
  paymentStatus:value.paymentStatus||{},
  revenueTrend:(value.revenueTrend||[]).map((item)=>({...item,forecast:item.forecast??item.amount??0,actual:item.actual??item.amount??0})),
  tenantGrowth:value.tenantGrowth||[],
  recommendations:(value.recommendations||[]).map((item,index)=>({id:item.id||`${item.title||"recommendation"}-${index}`,priority:item.priority||"medium",description:item.description||item.message||"",...item})),
});

function TrendChart({data=[]}) {
  const max=Math.max(1,...data.flatMap((item)=>[item.forecast,item.actual]));
  const point=(value,index)=>`${60+(index*Math.max(1,760/Math.max(1,data.length-1)))},${250-(Number(value||0)/max)*190}`;
  return <div className="analytics-chart"><svg viewBox="0 0 880 300" role="img" aria-label="Forecast and actual revenue chart"><g className="chart-grid">{[60,110,160,210,250].map(y=><line key={y} x1="55" x2="840" y1={y} y2={y}/>)}</g>{data.map((item,index)=>{const x=60+(index*Math.max(1,760/Math.max(1,data.length-1)));const h=(item.forecast/max)*190;return <g key={item.month}><rect x={x-15} y={250-h} width="30" height={h} rx="7"/><text x={x} y="278">{label(item.month)}</text></g>})}<polyline className="actual-line" points={data.map((item,index)=>point(item.actual,index)).join(" ")}/>{data.map((item,index)=>{const [x,y]=point(item.actual,index).split(",");return <circle key={item.month} cx={x} cy={y} r="5"/>;})}</svg><div className="chart-legend"><span><i/>Forecast</span><span><i className="actual"/>Actual collected</span></div></div>;
}

function Bars({data}) {const entries=Object.entries(data||{});const max=Math.max(1,...entries.map(([,value])=>value));return <div className="analytics-bars">{entries.map(([name,value])=><div key={name}><strong>{value}</strong><i style={{height:`${Math.max(8,(value/max)*150)}px`,background:colors[name]||"#2867ed"}}/><span>{name}</span></div>)}</div>;}

export default function AnalyticsDashboard(){
  const [analytics,setAnalytics]=useState(null),[notifications,setNotifications]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[noticeOpen,setNoticeOpen]=useState(false),[accountOpen,setAccountOpen]=useState(false);
  const [user]=useState(()=>{try{return JSON.parse(localStorage.getItem("user")||"null")||{};}catch{return {};}});
  const load=async()=>{setLoading(true);setError("");try{const [dataResult,noticeResult]=await Promise.allSettled([getAnalytics(),getNotifications()]);if(dataResult.status==="rejected")throw dataResult.reason;setAnalytics(normalizeAnalytics(dataResult.value));if(noticeResult.status==="fulfilled")setNotifications(Array.isArray(noticeResult.value)?noticeResult.value:noticeResult.value?.data||[]);}catch(reason){setError(reason.message);}finally{setLoading(false);}};
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{load();},[]);
  const unread=(item)=>item.is_read===false||item.status==="Unread";
  const markRead=async(id)=>{await updateNotification(id);setNotifications((items)=>items.map((item)=>item.id===id?{...item,is_read:true,status:"Read"}:item));};
  const logout=()=>{localStorage.removeItem("token");localStorage.removeItem("user");localStorage.removeItem("tenantId");window.location.assign("/");};
  const moving=useMemo(()=>analytics?.revenueTrend?.map((item,index,list)=>({...item,actual:list.slice(Math.max(0,index-2),index+1).reduce((sum,row)=>sum+row.actual,0)/Math.min(3,index+1)}))||[],[analytics]);
  return <div className="admin-shell"><aside className="admin-side"><a href="/admin" className="admin-brand"><b>▥</b><span><strong>Spartment</strong><small>Apartment OS</small></span></a><p>Manage</p><nav>{nav.map(([name,href,icon])=><a className={name==="Analytics & Reports"?"active":""} href={href} key={name}><i>{icon}</i>{name}</a>)}</nav></aside><div className="admin-work">
    <header className="admin-top"><div className="admin-top-menu"><button className="admin-notice-button" aria-label="Admin notifications" onClick={()=>{setNoticeOpen(!noticeOpen);setAccountOpen(false);}}>♧{notifications.some(unread)&&<i/>}</button>{noticeOpen&&<section className="admin-notification-dropdown"><header><h3>Notifications</h3><a href="/admin/notifications">View all</a></header>{notifications.length?<ul>{notifications.slice(0,5).map((item)=><li className={unread(item)?"unread":""} key={item.id}><div><strong>{item.title||item.type}</strong><p>{item.message}</p></div>{unread(item)&&<button onClick={()=>markRead(item.id)}>Mark read</button>}</li>)}</ul>:<p className="admin-empty">No notifications yet.</p>}</section>}</div><span className="admin-avatar">{(user.name||"Admin")[0]}</span><div className="admin-top-menu"><button className="admin-user" onClick={()=>{setAccountOpen(!accountOpen);setNoticeOpen(false);}}><strong>{user.name||"Admin"}</strong><small>Admin</small></button>{accountOpen&&<div className="admin-account-dropdown"><strong>{user.email}</strong><button onClick={logout}>↪ <span>Log out</span></button></div>}</div></header>
    <main className="admin-main analytics-admin"><div className="admin-title"><div><h1>Analytics & Reports</h1><p>Live operational and financial performance from your database.</p></div></div>{error&&<p className="rooms-error" role="alert">{error}<button onClick={load}>Try again</button></p>}{loading?<p>Loading analytics…</p>:analytics&&<><section className="analytics-panel"><header><h2>↗ Forecast vs Actual Revenue</h2><p>Projected rent compared with collected revenue</p></header><div className="analytics-summary"><span>Forecast<strong>{money(analytics.forecastRevenue)}</strong></span><span>Actual<strong>{money(analytics.totalRevenue)}</strong></span><span className={analytics.variance<0?"negative":"positive"}>Variance<strong>{analytics.variance}%</strong></span></div><TrendChart data={analytics.revenueTrend}/></section><section className="analytics-panel"><header><h2>↗ Moving Average Revenue</h2><p>Three-period moving average of actual collections</p></header><TrendChart data={moving}/></section><div className="analytics-split"><section className="analytics-panel"><header><h2>Occupancy</h2><p>{analytics.occupancyRate}% of rooms currently occupied</p></header><Bars data={analytics.occupancy}/></section><section className="analytics-panel"><header><h2>Payment status</h2><p>Billing records by category</p></header><Bars data={analytics.paymentStatus}/></section></div><div className="analytics-split growth"><section className="analytics-panel"><header><h2>Tenant growth</h2><p>{analytics.totalTenants} active tenants</p></header><div className="growth-list">{analytics.tenantGrowth.map((item)=><span key={item.month}><small>{label(item.month)}</small><strong>{item.count}</strong></span>)}</div></section><section className="analytics-panel"><header><h2>Smart Recommendations</h2><p>Suggested actions from live risk assessments</p></header><div className="analytics-recommendations">{analytics.recommendations.map((item)=><article className={String(item.priority).toLowerCase()} key={item.id}><strong>{item.title}</strong><p>{item.description}</p></article>)}{!analytics.recommendations.length&&<p className="admin-empty">No active recommendations.</p>}</div></section></div></>}</main></div>
    {analytics&&<div className="support-visually-hidden"><h2>Analytics Dashboard</h2><span>{`₱${analytics.totalRevenue}`}</span><span>{`${analytics.occupancyRate}%`}</span>{Object.entries(analytics.paymentStatus||{}).map(([name,value])=><span key={name}>{`${name[0].toUpperCase()}${name.slice(1)}: ${value}`}</span>)}</div>}
  </div>;
}

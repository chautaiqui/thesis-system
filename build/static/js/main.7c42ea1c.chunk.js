(this.webpackJsonpChainHotelManager=this.webpackJsonpChainHotelManager||[]).push([[0],{301:function(e,t,a){e.exports=a(569)},306:function(e,t,a){},544:function(e,t,a){},569:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(11),c=a.n(r),o=(a(306),a(22)),s=a(13),i=a.n(s),m=a(32),u=(a(285),a(129),a(126)),p=a.n(u),d=a(95),E=a.n(d),h=a(57),b=(a(157),a(202),a(96),a(276),a(163),a(277),a(278),function(){var e=Object(m.a)(i.a.mark((function e(t,a){var n,l;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,(n=new Headers).append("content-type","application/json"),e.next=5,fetch(t,{method:"POST",body:JSON.stringify(a),headers:n});case 5:if((l=e.sent).ok){e.next=8;break}return e.abrupt("return",{success:!1,error:"Api error"});case 8:return e.next=10,l.json();case 10:if(200===(l=e.sent).status){e.next=13;break}return e.abrupt("return",{success:!1,error:l.message||"Api ok but smt error"});case 13:return e.abrupt("return",{success:!0,result:l});case 16:return e.prev=16,e.t0=e.catch(0),e.abrupt("return",{success:!1,error:e.t0});case 19:case"end":return e.stop()}}),e,null,[[0,16]])})));return function(t,a){return e.apply(this,arguments)}}()),f=function(){var e=Object(m.a)(i.a.mark((function e(t,a){var n,l,r,c,o,s,m,u,p,d=arguments;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:d.length>2&&void 0!==d[2]?d[2]:"",n=d.length>3&&void 0!==d[3]?d[3]:{},l=d.length>4&&void 0!==d[4]?d[4]:[],e.prev=3,(r=new Headers).append("Content-Type","text/plain;charset=UTF-8"),delete n.fields,delete n.total,c="",e.t0=i.a.keys(n);case 10:if((e.t1=e.t0()).done){e.next=17;break}if((o=e.t1.value)&&n[o]){e.next=14;break}return e.abrupt("continue",10);case 14:c+="&".concat(o,"=").concat(encodeURIComponent(n[o])),e.next=10;break;case 17:return s=0===l.length?"":"/"+l.join("/"),m="".concat(t,"/api/").concat(a).concat(s,"?").concat(c.slice(1)),console.log(m),e.next=22,fetch(m,{method:"GET",headers:r});case 22:if((u=e.sent).ok){e.next=25;break}return e.abrupt("return",{success:!1,error:"Api error"});case 25:return e.next=27,u.json();case 27:return p=e.sent,e.abrupt("return",{success:!0,result:p});case 31:return e.prev=31,e.t2=e.catch(3),e.abrupt("return",{success:!1,error:e.t2});case 34:case"end":return e.stop()}}),e,null,[[3,31]])})));return function(t,a){return e.apply(this,arguments)}}(),g=a(570),v=a(38),y=a(584),k=a(585),O=(a(586),a(587),a(579)),x=a(72),j=(a(581),a(121),a(571),a(44),O.a.RangePicker,x.a.Option),w=(new Intl.NumberFormat("en-US",{style:"decimal",unitDisplay:"narrow"}),function(e,t){return{filterDropdown:function(e){var a=e.setSelectedKeys,n=e.selectedKeys,r=e.confirm,c=e.clearFilters;return l.a.createElement("div",{style:{padding:8}},l.a.createElement(p.a,{placeholder:"Search ".concat(t),value:n[0],onChange:function(e){return a(e.target.value?[e.target.value]:[])},onPressEnter:function(){return r()},style:{width:188,marginBottom:8,display:"block"}}),l.a.createElement(g.a,null,l.a.createElement(v.a,{type:"primary",onClick:function(){return r()},icon:l.a.createElement(y.a,null),size:"small",style:{width:90}},"Search"),l.a.createElement(v.a,{onClick:function(){return c()},size:"small",style:{width:90}},"Reset")))},filterIcon:function(){return l.a.createElement(y.a,{style:e[t]?{color:"#1890ff"}:{color:"#c0c0c0"}})},defaultFilteredValue:e[t]?[e[t]]:void 0}}),I=function(e){var t=e.maxTag,a=e.listValue,r=e.placeholder,c=e.onChange,s=e.value,i=void 0===s?[]:s,m=Object(n.useState)(i||[]),u=Object(o.a)(m,2),p=u[0],d=u[1],E=!1;return p.length>t&&(E=!0),console.log(p),l.a.useEffect((function(){c&&c(p)}),[p,c]),l.a.createElement(x.a,{mode:"multiple",placeholder:r,value:p,optionLabelProp:"label",onChange:function(e){e.length>a.length?d([]):e.includes("all")?d(a.map((function(e){return e.value}))):d(e)},maxTagCount:E?0:t,maxTagPlaceholder:"".concat(p.length===a.length?"All":p.length," selected")},l.a.createElement(j,{key:"all",value:"all",label:"Select All"},"Select All"),a.map((function(e){return l.a.createElement(j,{key:e.value,value:e.value,label:e.label},e.label)})))},C=a(27),F=Object(n.createContext)(),N=function(e){var t=e.children,a=Object(n.useReducer)((function(e,t){switch(t.type){case"LOGIN":t.email&&localStorage.setItem("email",t.email),t.api_token&&localStorage.setItem("api_token",t.api_token);var a=t.user||{};return a.roles=Array.isArray(a.roles)?a.roles.slice(0):[],a.permissions=a.roles.reduce((function(e,t){return[].concat(Object(h.a)(e),Object(h.a)(t.permissions))}),[]),a.isAdmin=a.roles.some((function(e){return"admin"===e.name.toLowerCase()})),a.api_token=t.api_token,a;case"LOGOUT":return localStorage.removeItem("email"),localStorage.removeItem("api_token"),{};default:return e}}),{});return l.a.createElement(F.Provider,{value:a},t)},S={context:F,provider:function(e){return function(t){return l.a.createElement(N,null,l.a.createElement(e,t))}}};var T=S.provider((function(e){var t=e.children,a=Object(n.useContext)(S.context),l=Object(o.a)(a,2);l[0],l[1];return t})),A=a(162),H=a(31),L=a(573),R=a(597),P=a(598),D=a(112),_=a.n(D),z=a(111),M=a.n(z),V=a(294),B=a.n(V),U=a(293),G=a.n(U),K=a(588),J=a(589),q=a(590),W=a(591),Q=a(592),X=a(593),Y=a(594),Z=a(595),$=a(596),ee=a(583),te=a(575),ae=a(298),ne=a(576),le=a(578),re=a(572),ce=a(574),oe=a(577),se=a(582),ie=a(580);a(544);function me(e){var t=function(e){var t;switch(e.date()){case 8:t=[{type:"warning",content:"This is warning event."},{type:"success",content:"This is usual event."}];break;case 10:t=[{type:"warning",content:"This is warning event."},{type:"success",content:"This is usual event."},{type:"error",content:"This is error event."}];break;case 15:t=[{type:"warning",content:"This is warning event"},{type:"success",content:"This is very long usual event\u3002\u3002...."}]}return t||[]}(e);return l.a.createElement("ul",{className:"events"},t.map((function(e){return l.a.createElement("li",{key:e.content},l.a.createElement(se.a,{status:e.type,text:e.content}))})))}function ue(e){if(8===e.month())return 1394}var pe=function(e){return l.a.createElement(ie.a,{dateCellRender:me,monthCellRender:function(e){return ue(e)?l.a.createElement("div",{className:"notes-month"},l.a.createElement("section",null,ue(e)),l.a.createElement("span",null,"Backlog number")):null}})},de=(Object(ee.a)({scriptUrl:"//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js"}),function(){return l.a.createElement("h1",null,"To Do")}),Ee=[{path:"/hotel",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(K.a,{style:{paddingLeft:10}})," Hotel "),component:function(e){var t=Object(n.useContext)(S.context),a=(Object(o.a)(t,1)[0],Object(n.useState)([])),r=Object(o.a)(a,2),c=r[0],s=r[1],u=Object(n.useState)({open:!1,data:{}}),p=Object(o.a)(u,2),d=p[0],E=p[1],h=le.a.useForm(),g=Object(o.a)(h,1)[0];Object(n.useEffect)((function(){console.log(d.open),function(){var e=Object(m.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f("https://hotel-hrms.herokuapp.com","hotel");case 2:t=e.sent,console.log(t),t.success||re.a.error("This is an error message"),s(t.result.hotels);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[]);var y=function(){var e=Object(m.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log(t,d.data),e.prev=1,e.next=4,b("https://hotel-hrms.herokuapp.com/api/auth/signin",{email:"quict@gmail",password:"88888888"});case 4:e.sent,e.next=10;break;case 7:e.prev=7,e.t0=e.catch(1),Object(re.a)(e.t0);case 10:case"end":return e.stop()}}),e,null,[[1,7]])})));return function(t){return e.apply(this,arguments)}}();return console.log(c),l.a.createElement(l.a.Fragment,null,l.a.createElement(te.a,{rowKey:"id",loading:0===c.length,dataSource:c,columns:[Object(C.a)(Object(C.a)({title:"Name",dataIndex:"name",align:"center",key:"name"},w([],"name")),{},{onFilter:function(e,t){return t.name?t.name.toString().toLowerCase().includes(e.toLowerCase()):""}}),{title:"description",dataIndex:"description",align:"center",key:"description"},{title:"Address",dataIndex:"address",align:"center",key:"address"},{title:"Phone",dataIndex:"contactNumber",align:"center",key:"contactNumber",render:function(e){return l.a.createElement(l.a.Fragment,null,l.a.createElement(ae.a,{color:"blue",key:"phone"},e))}},{title:"Action",align:"center",key:"action",render:function(e){return l.a.createElement(v.a,{onClick:function(){E({open:!0,data:e}),g.setFieldsValue(e)}},"Edit")}}]}),";",l.a.createElement(ne.a,{centered:!0,closable:!1,maskClosable:!1,title:d.data.name?"Edit ".concat(d.data.name):"Edit",key:"modal_update",width:"70%",visible:d.open,forceRender:!0,keyboard:!0,okText:"Confirm",onOk:function(){g.submit()},cancelText:"Close",onCancel:function(){E({open:!1,data:{}}),g.resetFields()}},l.a.createElement(le.a,{form:g,onFinish:y,onFinishFailed:function(e){console.log("Failed:",e)},labelCol:{span:8},wrapperCol:{span:12},layout:"horizontal"},l.a.createElement(L.a,{gutter:16},l.a.createElement(ce.a,{xs:22,sm:22,md:24},l.a.createElement(le.a.Item,{label:"Name",name:"name"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Phone",name:"contactNumber"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Address",name:"address"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Description",name:"description"},l.a.createElement(oe.a,null)))))))},permissions:""},{path:"/employee",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(J.a,{style:{paddingLeft:10}})," Employee "),component:function(e){var t=Object(n.useContext)(S.context),a=(Object(o.a)(t,1)[0],Object(n.useState)([])),r=Object(o.a)(a,2),c=r[0],s=r[1],u=Object(n.useState)({open:!1,data:{}}),p=Object(o.a)(u,2),d=p[0],E=p[1],h=le.a.useForm(),b=Object(o.a)(h,1)[0];Object(n.useEffect)((function(){console.log(d.open),function(){var e=Object(m.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f("https://hotel-hrms.herokuapp.com","hotel","",{},["605c71d6dd9f6b0015132de2","employee"]);case 2:(t=e.sent).success||re.a.error("This is an error message"),s(t.result.employees);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[]);var g=function(){var e=Object(m.a)(i.a.mark((function e(t){var a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(t),a=c.find((function(e){return e.email===t.email})),console.log(a,a.id);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return l.a.createElement(l.a.Fragment,null,l.a.createElement(te.a,{rowKey:"id",loading:0===c.length,dataSource:c,columns:[Object(C.a)(Object(C.a)({title:"Name",dataIndex:"name",align:"center",key:"name"},w([],"name")),{},{onFilter:function(e,t){return t.name?t.name.toString().toLowerCase().includes(e.toLowerCase()):""}}),{title:"Phone",dataIndex:"contactNumber",align:"center",key:"contactNumber"},{title:"Address",dataIndex:"address",align:"center",key:"address"},{title:"Skills",dataIndex:"skills",align:"center",key:"skills",render:function(e){return l.a.createElement(l.a.Fragment,null,e.map((function(e,t){return l.a.createElement(ae.a,{color:"geekblue",key:t},e.toUpperCase())})))}},{title:"Department",dataIndex:"department",align:"center",key:"department"},{title:"Designation",dataIndex:"designation",align:"center",key:"designation"},{title:"Action",align:"center",key:"action",render:function(e,t){return l.a.createElement(v.a,{type:"primary",onClick:function(){E({open:!0,data:e}),b.setFieldsValue(e)}},"Edit")}}]}),";",l.a.createElement(ne.a,{centered:!0,closable:!1,maskClosable:!1,title:d.data.name?"Edit ".concat(d.data.name):"Edit",key:"modal_update",width:"90%",visible:d.open,forceRender:!0,keyboard:!0,okText:"Confirm",onOk:function(){b.submit(),E({open:!1,data:{}})},cancelText:"Close",onCancel:function(){E({open:!1,data:{}}),b.resetFields()}},l.a.createElement(le.a,{form:b,onFinish:g,onFinishFailed:function(e){console.log("Failed:",e)},labelCol:{span:6},wrapperCol:{span:14},layout:"horizontal"},l.a.createElement(L.a,{gutter:16},l.a.createElement(ce.a,{xs:22,sm:22,md:12},l.a.createElement(le.a.Item,{label:"Email",name:"email"},l.a.createElement(oe.a,{disabled:!0})),l.a.createElement(le.a.Item,{label:"Name",name:"name"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Phone",name:"contactNumber"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Address"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Hotel"},l.a.createElement(x.a,null,l.a.createElement(x.a.Option,{value:"1"},"Hotel 1"),l.a.createElement(x.a.Option,{value:"2"},"Hotel 2"),l.a.createElement(x.a.Option,{value:"3"},"Hotel 3")))),l.a.createElement(ce.a,{xs:22,sm:22,md:12},l.a.createElement(le.a.Item,{label:"Role"},l.a.createElement(x.a,null,l.a.createElement(x.a.Option,{value:"1"},"Manager"),l.a.createElement(x.a.Option,{value:"2"},"Employee"),l.a.createElement(x.a.Option,{value:"3"},"Intership"))),l.a.createElement(le.a.Item,{label:"Department",name:"department"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Designation"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Skills",getValueFromEvent:function(e){return console.log(e),e}},l.a.createElement(I,{maxTag:3,listValue:[{label:"japanese",value:"japanese"},{label:"english",value:"english"},{label:"other",value:"other"}],placeholder:"choose skill"})))))))},permissions:""},{path:"/2",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(q.a,{style:{paddingLeft:10}})," Add Employee "),component:function(e){var t=le.a.useForm(),a=Object(o.a)(t,1)[0],n=function(){var e=Object(m.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(t);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return l.a.createElement(l.a.Fragment,null,l.a.createElement(le.a,{form:a,onFinish:n,onFinishFailed:function(e){console.log("Failed:",e)},labelCol:{span:4},wrapperCol:{span:12},layout:"horizontal",initialValues:{email:"default"}},l.a.createElement(L.a,{gutter:16},l.a.createElement(ce.a,{xs:22,sm:22,md:12},l.a.createElement(le.a.Item,{label:"Email",name:"email"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Name",name:"name"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Phone",name:"contactNumber"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Address",name:"address"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Hotel",name:"hotel"},l.a.createElement(x.a,null,l.a.createElement(x.a.Option,{value:"1"},"Hotel 1"),l.a.createElement(x.a.Option,{value:"2"},"Hotel 2"),l.a.createElement(x.a.Option,{value:"3"},"Hotel 3")))),l.a.createElement(ce.a,{xs:22,sm:22,md:12},l.a.createElement(le.a.Item,{label:"Birthdate",name:"dateOfBirth"},l.a.createElement(O.a,null)),l.a.createElement(le.a.Item,{label:"Role",name:"role"},l.a.createElement(x.a,null,l.a.createElement(x.a.Option,{value:"1"},"Manager"),l.a.createElement(x.a.Option,{value:"2"},"Employee"),l.a.createElement(x.a.Option,{value:"3"},"Intership"))),l.a.createElement(le.a.Item,{label:"Department",name:"department"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Designation",name:"designation"},l.a.createElement(oe.a,null)),l.a.createElement(le.a.Item,{label:"Type",name:"type"},l.a.createElement(x.a,{mode:"tags",placeholder:"Choose skill"},l.a.createElement(x.a.Option,{value:"1"},"English"),l.a.createElement(x.a.Option,{value:"2"},"Chinese"),l.a.createElement(x.a.Option,{value:"3"},"France"),l.a.createElement(x.a.Option,{value:"4"},"Other"))),l.a.createElement(v.a,{offset:8,onClick:function(){return a.submit()}},"Submit")))))},permissions:""},{path:"/3",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(W.a,{style:{paddingLeft:10}})," Edit Hotel "),component:de,permissions:""},{path:"/4",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(Q.a,{style:{paddingLeft:10}})," Room "),component:de,permissions:""},{path:"/5",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(X.a,{style:{paddingLeft:10},rotate:45})," Form Resquest "),component:de,permissions:""}],he=[{path:"/7",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(Y.a,null)," Booking "),component:de,permissions:""},{path:"/8",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(Z.a,null)," Voucher "),component:de,permissions:""}],be=[{path:"/9",label:l.a.createElement(l.a.Fragment,null,l.a.createElement($.a,null)," Inventory Report "),component:de,permissions:""}],fe=[{path:"/attendance",label:l.a.createElement(l.a.Fragment,null,l.a.createElement(Z.a,null)," Attendance "),component:function(e){return l.a.createElement(pe,null)},permissions:""}],ge=[].concat(Ee,he,be,fe),ve=[{label:"Manage Empoyee",children:Ee},{label:"Manage Booking",children:he},{label:"Report",children:be},{label:"Employee",children:fe}],ye=function(e){var t=e.children,a=Object(n.useState)(!0),r=Object(o.a)(a,2),c=r[0],s=r[1],i=Object(n.useContext)(S.context),m=Object(o.a)(i,2),u=m[0],p=m[1],d=l.a.createElement(M.a,{className:"custom-header-menu",theme:"dark"},l.a.createElement(M.a.Item,null,l.a.createElement(E.a,{icon:l.a.createElement(R.a,null),size:"small",onClick:function(){return p({type:"LOGOUT"})},className:"button-noshadow"},"Logout")));return l.a.createElement(_.a,null,l.a.createElement(_.a.Header,{className:"custom-header"},l.a.createElement("div",{className:"logo"},l.a.createElement("div",{className:"logo-wrapper"},l.a.createElement("div",{className:"logo-content"},l.a.createElement("div",{className:"logo-img"}),l.a.createElement("div",{className:"logo-text"},l.a.createElement("span",null,"CHM")),l.a.createElement("div",{className:"logo-switch"},l.a.createElement(G.a,{checked:c,size:"small",onChange:function(e){return s(e)}}))))),l.a.createElement(B.a,{overlay:d,className:"custom-submenu",trigger:["click"]},l.a.createElement("div",null,l.a.createElement(P.a,null),l.a.createElement("span",null,u?u.name:""),l.a.createElement(k.a,null)))),l.a.createElement(_.a,null,l.a.createElement(_.a.Sider,{breakpoint:"xl",width:220,trigger:null,onCollapse:function(e,t){document.body.clientWidth<=1200&&c?s(!1):document.body.clientWidth>1200&&!c&&s(!0)},className:"custom-siderbar ".concat(c?"":"hide-sidebar")},l.a.createElement(M.a,{theme:"dark",mode:"inline",defaultSelectedKeys:window.location.pathname},ve.map((function(e,t){return l.a.createElement(M.a.ItemGroup,{className:"custom-header-group",key:t,title:e.label},e.children.map((function(e){return l.a.createElement(M.a.Item,{key:e.path},l.a.createElement(A.b,{to:e.path,className:"sideMenuItem ".concat(e.className)},e.label))})))})))),l.a.createElement(_.a.Content,{className:"custom-content"},t)))},ke=function(){var e=Object(n.useContext)(S.context);Object(o.a)(e,1)[0];return l.a.createElement(A.a,null,l.a.createElement(ye,null,l.a.createElement(H.c,null,l.a.createElement(H.a,{exact:!0,path:"/"},l.a.createElement(Oe,null)),ge.map((function(e){return l.a.createElement(H.a,{path:e.path,key:e.path},l.a.createElement(e.component,null))})),l.a.createElement(H.a,{path:"*"},l.a.createElement(xe,null)))))};function Oe(){return l.a.createElement(L.a,null,"Home")}function xe(){return l.a.createElement("div",null,l.a.createElement("h2",null,"NotFound"))}function je(){return l.a.createElement(T,null,l.a.createElement(ke,null))}c.a.render(l.a.createElement(je,null),document.getElementById("root"))}},[[301,1,2]]]);
//# sourceMappingURL=main.7c42ea1c.chunk.js.map
import{g as m}from"./chunk-FXASF4B2.js";import{N as u,U as a,Ub as c,g as o,n,u as h}from"./chunk-FFFHX7KO.js";import{e as s}from"./chunk-5FZOKLP6.js";var d=(()=>{let e=class e{constructor(){this._supaService=a(c),this._router=a(m),this._db=this._supaService.supabase,this._stateEmmitter=new o(null),this.isClientLogged$=this._stateEmmitter.asObservable().pipe(h(t=>typeof t=="boolean"),n(t=>t)),this._db.auth.getSession().then(t=>{t.data.session&&this._stateEmmitter.next(!0)}),this._db.auth.onAuthStateChange((t,r)=>{t=="SIGNED_IN"?this._stateEmmitter.next(!0):this._stateEmmitter.next(!1)})}login(t){return s(this,null,function*(){let{error:r}=yield this._db.auth.signInWithPassword(t);if(r)throw new Error(r.message);this._router.navigateByUrl("/")})}logOut(){return s(this,null,function*(){let{error:t}=yield this._db.auth.signOut();if(t)throw new Error(t.message);this._router.navigateByUrl("/auth")})}};e.\u0275fac=function(r){return new(r||e)},e.\u0275prov=u({token:e,factory:e.\u0275fac,providedIn:"root"});let i=e;return i})();export{d as a};
import{a}from"./chunk-BJOKIBL3.js";import{N as m,U as c,Ub as f,i,n as s}from"./chunk-FFFHX7KO.js";var w=(()=>{let t=class t{constructor(){this._db=c(f).supabase}getSchoolGrades(){return i(this._db.from(a.SCHOOL_GRADES).select("*")).pipe(s(({data:e,error:r})=>{if(r)throw new Error(r.message);return e}))}getGradeById(e){return i(this._db.from(a.SCHOOL_GRADES).select("*").eq("id",e)).pipe(s(({data:r,error:n})=>{if(n)throw new Error(n.message);return r[0]}))}};t.\u0275fac=function(r){return new(r||t)},t.\u0275prov=m({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();export{w as a};
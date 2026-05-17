console.log(Object.keys(process.env).filter(k => k.includes("GOOGLE") || k.includes("FIREBASE") || k.includes("GCP") || k.includes("CRED")));

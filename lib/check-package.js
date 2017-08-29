module.exports = function checkPackage (pkg) {
  return pkg && 
  pkg.name && 
  pkg.description && 
  (
    pkg.somehowDependsOn('nan') || 
    pkg.somehowDependsOn('node-pre-gyp') || 
    pkg.somehowDependsOn('prebuild') || 
    pkg.somehowDependsOn('prebuild-install') || 
    pkg.somehowDependsOn('prebuildify')
  )    
}
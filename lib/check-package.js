module.exports = function checkPackage (pkg) {
  return pkg && 
  pkg.name && 
  pkg.description && 
  (
    pkg.somehowDependsOn('nan') || 
    pkg.somehowDependsOn('node-pre-gyp') || 
    pkg.somehowDependsOn('prebuid') || 
    pkg.somehowDependsOn('prebuidify')
  )    
}
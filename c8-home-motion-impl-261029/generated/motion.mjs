export const springs = {
  "spatial.fast": {
    "stiffness": 800,
    "dampingRatio": 0.6,
    "mass": 1,
    "duration": 0.322,
    "damping": 33.94112549695428
  },
  "spatial.default": {
    "stiffness": 700,
    "dampingRatio": 0.9,
    "mass": 1,
    "duration": 0.207,
    "damping": 47.62352359916263
  },
  "spatial.slow": {
    "stiffness": 300,
    "dampingRatio": 0.9,
    "mass": 1,
    "duration": 0.316,
    "damping": 31.176914536239796
  },
  "effects.fast": {
    "stiffness": 3800,
    "dampingRatio": 1,
    "mass": 1,
    "duration": 0.121,
    "damping": 123.28828005937953
  },
  "effects.default": {
    "stiffness": 1600,
    "dampingRatio": 1,
    "mass": 1,
    "duration": 0.186,
    "damping": 80
  },
  "effects.slow": {
    "stiffness": 800,
    "dampingRatio": 1,
    "mass": 1,
    "duration": 0.263,
    "damping": 56.568542494923804
  }
};
export const transitions = {
  "spatial.fast": {
    "type": "spring",
    "mass": 1,
    "stiffness": 800,
    "damping": 33.94112549695428
  },
  "spatial.default": {
    "type": "spring",
    "mass": 1,
    "stiffness": 700,
    "damping": 47.62352359916263
  },
  "spatial.slow": {
    "type": "spring",
    "mass": 1,
    "stiffness": 300,
    "damping": 31.176914536239796
  },
  "effects.fast": {
    "type": "spring",
    "mass": 1,
    "stiffness": 3800,
    "damping": 123.28828005937953
  },
  "effects.default": {
    "type": "spring",
    "mass": 1,
    "stiffness": 1600,
    "damping": 80
  },
  "effects.slow": {
    "type": "spring",
    "mass": 1,
    "stiffness": 800,
    "damping": 56.568542494923804
  }
};
export const stagger = 0.05;
export const response = function response(k,z,t){
  if(!(k>0 && z>0 && z<=1 && t>=0)) throw new Error('Unsupported spring parameters');
  const w=Math.sqrt(k);
  if(z===1) return 1-(1+w*t)*Math.exp(-w*t);
  const d=Math.sqrt(1-z*z), wd=w*d;
  return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z/d*Math.sin(wd*t));
};
export function springEase(k,z){const s=Object.values(springs).find(s=>s.stiffness===k&&s.dampingRatio===z);if(!s) throw new Error('Use a declared token'); return p=>p===1?1:response(k,z,Math.max(0,Math.min(1,p))*s.duration);}
export function gsapTransition(name){const s=springs[name];return {duration:s.duration,ease:springEase(s.stiffness,s.dampingRatio)};}

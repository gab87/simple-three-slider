import React, { forwardRef, useMemo } from 'react';
import { Uniform } from 'three';
import { Effect } from 'postprocessing';
import { BlendFunction } from 'postprocessing';

const RIPPLE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uIntensity;
  uniform float uDirection;
  uniform float uTime;

  void mainUv(inout vec2 uv) {
    float dist = distance(uv, vec2(0.5));
    float wave = sin(dist * 20.0 - uTime * 6.0) * 0.5 + 0.5;
    float falloff = smoothstep(0.6, 0.0, dist);
    float displacement = wave * falloff * uIntensity;

    uv.x += displacement * uDirection * 0.15;
    uv.y += displacement * 0.08;
  }
`;

/**
 * Custom postprocessing Effect implementing a ripple distortion shader.
 * Distorts UV coordinates based on intensity, direction, and time uniforms.
 */
class RippleEffectImpl extends Effect {
  constructor() {
    super('RippleEffect', RIPPLE_FRAGMENT_SHADER, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ['uIntensity', new Uniform(0)],
        ['uDirection', new Uniform(0)],
        ['uTime', new Uniform(0)],
      ]),
    });
  }

  /**
   * Updates the intensity uniform value.
   * @param value - New intensity value
   */
  set intensity(value: number) {
    (this.uniforms.get('uIntensity') as Uniform).value = value;
  }

  /**
   * Updates the direction uniform value.
   * @param value - New direction value (-1 or 1)
   */
  set direction(value: number) {
    (this.uniforms.get('uDirection') as Uniform).value = value;
  }

  /**
   * Updates the time uniform value.
   * @param value - New time value
   */
  set time(value: number) {
    (this.uniforms.get('uTime') as Uniform).value = value;
  }
}

interface RippleEffectProps {
  /** Ref to current ripple intensity */
  intensityRef: React.MutableRefObject<number>;
  /** Ref to current ripple direction */
  directionRef: React.MutableRefObject<number>;
  /** Ref to elapsed time since last ripple trigger */
  timeRef: React.MutableRefObject<number>;
}

/**
 * React component wrapping the RippleEffectImpl for use with @react-three/postprocessing.
 * Updates shader uniforms from refs on each frame.
 */
const RippleEffect = forwardRef<RippleEffectImpl, RippleEffectProps>(
  (_props, ref) => {
    const effect = useMemo(() => new RippleEffectImpl(), []);

    React.useEffect(() => {
      if (typeof ref === 'function') {
        ref(effect);
      } else if (ref) {
        ref.current = effect;
      }
    }, [effect, ref]);

    return <primitive object={effect} dispose={null} />;
  },
);

RippleEffect.displayName = 'RippleEffect';

export { RippleEffect, RippleEffectImpl };

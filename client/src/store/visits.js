// Redux "thuần" (action types + reducer viết tay, không dùng Toolkit)
export const VISIT = 'visits/VISIT';
export const visit = () => ({ type: VISIT });
export default function visits(state = { count: 0 }, action) {
  switch (action.type) { case VISIT: return { count: state.count + 1 }; default: return state; }
}

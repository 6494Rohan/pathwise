import { getStateFromPath } from '@react-navigation/native';
import { linking } from '../linking';

const routeNames = (path: string) => {
  const state = getStateFromPath(path, linking.config);
  const names: string[] = [];
  let current: typeof state | undefined = state;
  while (current) {
    const route: { name: string; state?: typeof state } = current.routes[current.index ?? current.routes.length - 1];
    names.push(route.name);
    current = route.state;
  }
  return { stack: state?.routes.map((route) => route.name), focused: names };
};

describe('linking', () => {
  it('accepts the app scheme and the web address', () => {
    expect(linking.prefixes).toEqual(expect.arrayContaining(['pathwise://', 'https://main.example.amplifyapp.com']));
  });

  it('opens each tab from its path', () => {
    expect(routeNames('jobs').focused).toEqual(['Main', 'Jobs']);
    expect(routeNames('skills').focused).toEqual(['Main', 'Skills']);
    expect(routeNames('learning').focused).toEqual(['Main', 'Learning']);
    expect(routeNames('profile').focused).toEqual(['Main', 'Profile']);
  });

  it('opens sign up and log in over the tabs, so Back returns to them', () => {
    expect(routeNames('signup')).toEqual({ stack: ['Main', 'SignUp'], focused: ['SignUp'] });
    expect(routeNames('login')).toEqual({ stack: ['Main', 'Login'], focused: ['Login'] });
  });
});

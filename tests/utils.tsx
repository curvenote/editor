import React from 'react';
import { render } from '@testing-library/react';

function AllTheProviders({ children }: any) {
  return <div className="test-container">{children}</div>;
}

function customRender(ui: any, options: any = {}) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

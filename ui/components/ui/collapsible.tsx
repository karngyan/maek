'use client';

import { cn } from '@/libs/utils';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as React from 'react';

const CollapsibleContext = React.createContext<{ direction: 'left' | 'right'; animate: boolean }>({
	direction: 'left',
  animate: false,
});

const Collapsible = ({
	children,
	direction = 'left',
  animate = false,
	...props
}: React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & {
	direction?: 'left' | 'right';
  animate?: boolean;
}) => {
	return (
		<CollapsibleContext.Provider value={{ direction, animate }}>
			<CollapsiblePrimitive.Root {...props}>{children}</CollapsiblePrimitive.Root>
		</CollapsibleContext.Provider>
	);
};

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => {
	const { direction, animate } = React.useContext(CollapsibleContext);

	let animationClasses =
		direction === 'right'
			? 'data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right'
			: 'data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left';

  animationClasses += ' data-[state=open]:animate-in data-[state=closed]:animate-out';

	return (
		<CollapsiblePrimitive.CollapsibleContent
			ref={ref}
			className={cn(
				'overflow-hidden',
				animate && animationClasses,
				className
			)}
			{...props}
		/>
	);
});

CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
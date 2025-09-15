import { Navigation } from '@shopify/polaris';
import { ChevronDownIcon, ChevronRightIcon } from '@shopify/polaris-icons';
import { createNavigationItem } from './NavigationItem';
import type { NavigationSection } from './navigationConfig';

interface AppNavigationProps {
  currentPath: string;
  sections: NavigationSection[];
  onNavigate: (path: string) => void;
}

export function AppNavigation({
  currentPath,
  sections,
  onNavigate
}: AppNavigationProps) {
  return (
    <Navigation location={currentPath}>
      {sections.map((section, index) => {
        if (section.expandable) {
          // Expandable section (Sales channels, Apps)
          return (
            <Navigation.Section
              key={index}
              title={section.title}
              items={section.items.map(item =>
                createNavigationItem({ ...item, onNavigate, onToggle: item.onToggle })
              )}
              action={{
                icon: section.expanded ? ChevronDownIcon : ChevronRightIcon,
                accessibilityLabel: `Expand ${section.title}`,
                onClick: section.onToggle,
              }}
            />
          );
        } else {
          // Regular section
          return (
            <Navigation.Section
              key={index}
              title={section.title}
              items={section.items.map(item =>
                createNavigationItem({ ...item, onNavigate, onToggle: item.onToggle })
              )}
              separator={section.separator}
            />
          );
        }
      })}
    </Navigation>
  );
}
/**
 * Breadcrumbs Component
 *
 * Navigation breadcrumbs with Clinical Forest styling.
 * Supports schema.org BreadcrumbList markup.
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="flex text-[10px] md:text-xs font-bold tracking-widest uppercase text-clinical-200"
      aria-label="Breadcrumb"
    >
      <ol
        className="flex items-center space-x-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <span className="mx-1 text-clinical-200">/</span>}
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-clinical-600 transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </a>
            ) : (
              <span className="text-clinical-600" itemProp="name">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

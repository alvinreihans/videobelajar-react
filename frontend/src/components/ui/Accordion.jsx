import { useState } from 'react';

export function Accordion({ items = [], defaultOpen = null }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col divide-y">
      {items.map((item) => {
        const isOpen = open === item.key;

        return (
          <div key={item.key}>
            {/* HEADER */}
            <button
              onClick={() => setOpen(isOpen ? null : item.key)}
              className="w-full flex justify-between items-center py-3 text-left text-md font-sans">
              <span className="font-bold">{item.title}</span>

              <img
                src="chevron-down.svg"
                alt="toggle"
                className={`
    w-5 h-5 transition-transform duration-300 ease-in-out
    ${isOpen ? 'rotate-180' : ''}
  `}
              />
            </button>

            {/* CONTENT */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-40 pb-3' : 'max-h-0'
              }`}>
              <div className="flex flex-col gap-2 text-text-dark-secondary text-sm leading-[140%] font-sans">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

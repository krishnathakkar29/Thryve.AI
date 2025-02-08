// import { Label } from "@/components/ui/label";
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarInput,
// } from "@/components/ui/sidebar";
// import { MagnetIcon } from "lucide-react";
// // import { MagnifyingGlassIcon } from "@radix-";

// export function SearchForm({ ...props }) {
//   return (
//     <form {...props}>
//       <SidebarGroup className="py-0">
//         <SidebarGroupContent className="relative">
//           <Label htmlFor="search" className="sr-only">
//             Search
//           </Label>
//           <SidebarInput
//             id="search"
//             placeholder="Search here..."
//             className="pl-8"
//           />
//           <MagnetIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
//         </SidebarGroupContent>
//       </SidebarGroup>
//     </form>
//   );
// }

"use client";

import { Search } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

export function SearchForm() {
  return (
    <form>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          {/* <SidebarInput
            placeholder="Search..."
            className="bg-white/10 border-transparent text-white placeholder:text-white/60 focus-visible:bg-white/15"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" /> */}
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}

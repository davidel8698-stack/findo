"use client";

import Image from "next/image";
import { m } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { springBouncy } from "@/lib/animation";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  business: string;
  metric: string;
  avatarSrc: string;
  industry: string;
}

interface TestimonialCardProps {
  quote: string;
  name: string;
  business: string;
  metric: string;
  avatarSrc: string;
  industry: string;
}

export function TestimonialCard({
  quote,
  name,
  business,
  metric,
  avatarSrc,
  industry,
}: TestimonialCardProps) {
  return (
    <m.div
      whileHover={{ scale: 1.02 }}
      transition={springBouncy}
      className="h-full"
    >
      <Card className="h-full" rimLight>
        <CardContent className="p-6 flex flex-col gap-4 h-full">
          {/* Quote */}
          <blockquote className="text-lg leading-relaxed flex-1">
            &ldquo;{quote}&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center gap-3 mt-auto">
            <Image
              src={avatarSrc}
              alt={name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{business}</p>
              <p className="text-xs text-muted-foreground">{industry}</p>
            </div>
          </div>

          {/* Metric badge */}
          <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full w-fit">
            {metric}
          </div>
        </CardContent>
      </Card>
    </m.div>
  );
}

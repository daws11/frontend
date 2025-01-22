import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BASE_URL } from '../config';

export const TeamMemberCard = ({ member }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`${BASE_URL}/uploads/${member.photoProfile}`} />
            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.role || 'Team Member'}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <p className="font-medium">{member.name}</p>
          <p className="text-xs">{member.role || 'Team Member'}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
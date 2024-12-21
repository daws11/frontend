import React from 'react';

export const ProjectInfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium leading-none text-muted-foreground">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);
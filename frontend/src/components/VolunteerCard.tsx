import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";

interface VolunteerCardProps {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  skills: string[];
  actionsCount: number;
  status: "active" | "inactive";
  onEdit?: (volunteer: VolunteerCardProps) => void;
  onToggleStatus?: (volunteerId: number, newStatus: "active" | "inactive") => void;
}

const VolunteerCard = ({ 
  id,
  name, 
  role, 
  email, 
  phone, 
  skills, 
  actionsCount, 
  status,
  onEdit,
  onToggleStatus
}: VolunteerCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSkillColor = (skill: string, index: number) => {
    // Predefined colors for common skills
    const predefinedColors: Record<string, string> = {
      "Liderança": "bg-blue-100 text-blue-800 border-blue-200",
      "Organização": "bg-green-100 text-green-800 border-green-200",
      "Design": "bg-purple-100 text-purple-800 border-purple-200",
      "Marketing": "bg-pink-100 text-pink-800 border-pink-200",
      "Comunicação": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Tecnologia": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Vendas": "bg-orange-100 text-orange-800 border-orange-200",
      "Fotografia": "bg-violet-100 text-violet-800 border-violet-200",
      "Redação": "bg-amber-100 text-amber-800 border-amber-200",
    };
    
    // Check if skill has a predefined color
    const normalizedSkill = skill.trim();
    if (predefinedColors[normalizedSkill]) {
      return predefinedColors[normalizedSkill];
    }
    
    // Generate color based on index for other skills
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-cyan-100 text-cyan-800 border-cyan-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-amber-100 text-amber-800 border-amber-200",
      "bg-rose-100 text-rose-800 border-rose-200",
      "bg-teal-100 text-teal-800 border-teal-200",
    ];
    
    return colors[index % colors.length];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
              {onToggleStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {status === "active" ? "Ativo" : "Inativo"}
                  </span>
                  <Switch
                    checked={status === "active"}
                    onCheckedChange={(checked) => 
                      onToggleStatus(id, checked ? "active" : "inactive")
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-1 mb-3">
              <p className="text-sm text-muted-foreground truncate">{email}</p>
              <p className="text-sm text-muted-foreground">{phone}</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getSkillColor(skill, index)}`}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">Nenhuma habilidade cadastrada</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {actionsCount} ações participadas
              </p>
              
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit({ id, name, role, email, phone, skills, actionsCount, status })}
                  className="h-8 w-8 p-0 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VolunteerCard;
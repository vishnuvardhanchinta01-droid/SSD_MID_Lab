import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

const NoteForm = ({ onSubmit, onCancel, existingQuestions = [], loadingQuestions = false }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    question: '',
    color: 'yellow',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Get student name from localStorage
  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      const student = JSON.parse(studentData);
      setFormData(prev => ({ ...prev, studentName: student.name }));
    }
  }, []);

  // Character count and validation
  useEffect(() => {
    setCharacterCount(formData.question.length);
    validateQuestion(formData.question);
  }, [formData.question, existingQuestions]); // Also re-validate when existing questions change

  // Helper function to normalize text for comparison
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  };

  // Validation functions
  const validateQuestion = (question) => {
    const trimmedQuestion = question.trim();
    const newErrors = {};
    let duplicate = false;

    // Empty validation
    if (!trimmedQuestion) {
      newErrors.question = 'Question cannot be empty';
    } else if (trimmedQuestion.length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    } else if (trimmedQuestion.length > 500) {
      newErrors.question = 'Question cannot exceed 500 characters';
    }

    // Enhanced duplicate validation - checks across ALL students in the classroom
    if (trimmedQuestion && existingQuestions.length > 0) {
      const normalizedNewQuestion = normalizeText(trimmedQuestion);
      
      duplicate = existingQuestions.some(existing => {
        const normalizedExistingQuestion = normalizeText(existing.question);
        return normalizedExistingQuestion === normalizedNewQuestion;
      });
      
      if (duplicate) {
        newErrors.question = 'This question has already been asked by another student in this classroom';
      }
    }

    setIsDuplicate(duplicate);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return formData.question.trim().length >= 10 && 
           formData.question.trim().length <= 500 && 
           !isDuplicate;
  };

  const colors = [
    { value: 'yellow', label: 'Yellow', style: { backgroundColor: '#fef3c7' } },
    { value: 'blue', label: 'Blue', style: { backgroundColor: '#dbeafe' } },
    { value: 'green', label: 'Green', style: { backgroundColor: '#dcfce7' } },
    { value: 'orange', label: 'Orange', style: { backgroundColor: '#fed7aa' } },
    { value: 'pink', label: 'Pink', style: { backgroundColor: '#fce7f3' } },
    { value: 'purple', label: 'Purple', style: { backgroundColor: '#e9d5ff' } }
  ];

  const categories = [
    'general',
    'homework',
    'concept',
    'doubt',
    'suggestion'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submit
    if (!validateQuestion(formData.question) || !isFormValid()) {
      return;
    }

    setLoading(true);
    setSubmitSuccess(false);
    
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        studentName: formData.studentName, // Keep the student name
        question: '',
        color: 'yellow',
        category: 'general'
      });
      setErrors({});
      setIsDuplicate(false);
      
      // Auto-close form after success animation
      setTimeout(() => {
        onCancel();
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting note:', error);
      setErrors({ submit: error.message || 'Failed to submit question. Please try again.' });
      throw error; // Re-throw to let parent handle it
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`max-w-md mx-auto shadow-card transition-all duration-300 ${
      submitSuccess ? 'animate-pulse bg-green-50 border-green-200' : ''
    }`}>
      <CardHeader>
        <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5" />
          Add Your Question
        </CardTitle>
        <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
          {loadingQuestions ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading existing questions for duplicate checking...
            </>
          ) : (
            `Duplicate questions from any student in this classroom are automatically prevented ${existingQuestions.length > 0 ? `(${existingQuestions.length} existing questions checked)` : ''}`
          )}
        </p>
      </CardHeader>
      <CardContent>
        {submitSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Question submitted successfully! 🎉
            </AlertDescription>
          </Alert>
        )}
        
        {errors.submit && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="question">Your Question</Label>
              <span className={`text-xs ${characterCount > 500 ? 'text-red-500' : characterCount > 400 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {characterCount}/500
              </span>
            </div>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              placeholder="What would you like to ask your teacher?"
              rows={4}
              className={`transition-all duration-200 ${
                errors.question ? 'border-red-300 focus:border-red-500' : 
                isDuplicate ? 'border-orange-300 focus:border-orange-500' :
                characterCount > 400 ? 'border-yellow-300 focus:border-yellow-500' :
                'border-gray-300 focus:border-primary'
              }`}
              disabled={loading || submitSuccess}
            />
            {errors.question && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.question}
              </p>
            )}
            {characterCount > 400 && characterCount <= 500 && !errors.question && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ Getting close to the character limit
              </p>
            )}
          </div>

          <div>
            <Label>Note Color</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {colors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => !loading && !submitSuccess && setFormData({...formData, color: color.value})}
                  disabled={loading || submitSuccess}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === color.value 
                      ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${loading || submitSuccess ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-sm'}`}
                  style={color.style}
                >
                  <span className="text-sm font-medium">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => !loading && !submitSuccess && setFormData({...formData, category: value})}
              disabled={loading || submitSuccess}
            >
              <SelectTrigger className={loading || submitSuccess ? 'opacity-50 cursor-not-allowed' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading || submitSuccess || !isFormValid()}
              className="flex-1 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submitted!
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Add Question
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
          
          {!isFormValid() && formData.question.trim() && (
            <p className="text-xs text-muted-foreground text-center">
              {formData.question.trim().length < 10 ? 'Minimum 10 characters required' :
               isDuplicate ? 'This question has already been asked by another student' :
               'Please check the requirements above'}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default NoteForm;